var fs = require('fs');
var multer = require('multer');
var PythonShell = require('python-shell');
var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  }),
});
var option = {
    mode : 'text',
    pythonPath: '',
    pythonOptions: ['-u'],
    scriptPath: '',
    args: ['image', 'page', 'result']
};

module.exports = function(router, passport) {
    console.log('user_passport 호출됨.');

    // 홈 화면
    router.route('/').get(function(req, res) {
        console.log('/ 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('index.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('index.ejs', {login_success:true});
        }
    }); 
      
    // 헤더파일
     router.route('/login_header').get(function(req, res) {
        console.log('/login_header 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/login_header 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('login_header.ejs', {user: req.user[0]._doc});
            } else {
                res.render('login_header.ejs', {user: req.user});
            }
        }
    });
    
    // 로그인 화면
    router.route('/login').get(function(req, res) {
        console.log('/login 패스 요청됨.');
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });
	 
    // 회원가입 화면
    router.route('/signup').get(function(req, res) {
        console.log('/signup 패스 요청됨.');
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });    
	 
    // 로그인 후 인덱스 화면
    router.route('/home').get(function(req, res) {
        console.log('/home 패스 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            
            var database = req.app.get('database');
            var Original = new database.Image();

            database.Image.find({}).sort({_id:-1}).exec(function(err, image){
                if(err) throw err;
                
            database.Result.find({}).sort({_id:-1}).exec(function(err, result){
                if(err) throw err;

            if (Array.isArray(req.user)) {
                res.render('home.ejs', {user: req.user[0]._doc, image:image, result:result});
            } else {
                res.render('home.ejs', {user: req.user, image:image, result:result});
            }
                
            });
            });
        }
    });
    
    // 프로필 화면
    router.route('/profile').get(function(req, res) {
        console.log('/profile 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/profile 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('profile.ejs', {user: req.user[0]._doc});
            } else {
                res.render('profile.ejs', {user: req.user});
            }
        }
    });
    
    
    // 회원정보 없음 화면
    router.route('/find_fail').get(function(req, res) {
        console.log('/find_fail 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('find_fail.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('index.ejs', {login_success:true});
        }
    });
    
    // 회원정보 있음 화면
    router.route('/find_success').get(function(req, res) {
        console.log('/find_success 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('index.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('find_success.ejs', {login_success:false});
        }
    });

     // 답안지 업로드 화면
    router.route('/upload').get(function(req, res) {
        console.log('/upload 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/upload 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('upload.ejs', {user: req.user[0]._doc});
            } else {
                res.render('upload.ejs', {user: req.user});
            }
        }
    });
    
     // 답안지 업로드 화면
    router.route('/upload').post(upload.single('file'), function(req, res) {
        console.log('/upload 패스 요청됨.');
               
        var database = req.app.get('database');
        var Original = new database.Image();
        
        console.log(req.file);
        if(req.file){
            Original.fileName = req.file.originalname;
            Original.path = req.file.path;
        }
        
        
        Original.save(function(err) {
		      if (err) {
		         throw err;
		      }
		      console.log("원본 이미지 추가함.");
        });
        
        PythonShell.run('scangraderpg.py', options, function(err, results){
                if(err) throw err;
        
        if (Array.isArray(req.user)) {
                res.render('process.ejs', {user: req.user[0]._doc, Original:Original});
            } else {
                res.render('process.ejs', {user: req.user, Original:Original});
            }
            
        });
        
    });
    
    // 답안지 스캐닝 화면 (get)
    router.route('/process').get(function(req, res) {
        console.log('/process 패스 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
        

            if (Array.isArray(req.user)) {
                res.render('process.ejs', {user: req.user[0]._doc});
            } else {
                res.render('process.ejs', {user: req.user});
            }
        }
    });
    
     // 답안지 스캐닝 화면 (post)
    router.route('/process').post(function(req, res) {
        console.log('/process 패스 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            
            var fileId = req.body.fileId;
        
            console.log(fileId);
            
            var database = req.app.get('database');
            database.Image.findOne({_id:fileId}, function(err, image){
            console.log(image);

            if (Array.isArray(req.user)) {
                res.render('scoring.ejs', {user: req.user[0]._doc, image:image});
            } else {
                res.render('scoring.ejs', {user: req.user, image:image});
            }
            });
        }
    });
    
     // 채점 결과 화면
    router.route('/scoring').get(function(req, res) {
        console.log('/scoring 패스 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');

            if (Array.isArray(req.user)) {
                res.render('scoring.ejs', {user: req.user[0]._doc});
            } else {
                res.render('scoring.ejs', {user: req.user});
            }
        }
    });
    
    // 게시판 인덱스 (get)
    router.route('/boardIndex').get(function(req, res) {
        console.log('/boardIndex 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {login_success:false});
        } else {            

                var database = req.app.get('database');            
                    
                database.Board.find({}).sort({date:-1}).exec(function(err, board){
                if(err) throw err;
                    
                database.Image.find({}).sort({_id:-1}).exec(function(err, image){
                if(err) throw err;
                    

                    if(err) throw err;

                    if(Array.isArray(req.user)){
                        res.render('boardIndex.ejs', {user: req.user[0]._doc, board:board, image:image});
                    }else{
                        res.render('boardIndex.ejs', {user: req.user, board:board, image:image});
                    }
               
                });
                });
        }
    });
    
    // 게시글 쓰기 (get)
    router.route('/boardWrite').get(function(req, res) {
        console.log('/boardWrite 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {login_success:false});
        } else {            
                var database = req.app.get('database');         
                    
                database.Board.find({}).sort({date:-1}).exec(function(err, board){
                if(err) throw err;
    
                    if(err) throw err;

                    if(Array.isArray(req.user)){
                        res.render('boardWrite.ejs', {user: req.user[0]._doc, board:board});
                    }else{
                        res.render('boardWrite.ejs', {user: req.user, board:board});
                    }
                });
        }
    });
    
    // 게시글 쓰기 (post)
    router.route('/boardWrite').post(function(req, res) {
        console.log('/boardWrite 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
            
        } else {
            console.log('사용자 인증된 상태임.');
            
                var moimId = req.body.moimid;
                var writer = req.body.writer;
                var title = req.body.title;
                var content = req.body.content;
                
                console.log(moimId+"모임 회차 세부 수정");
            
                var database = req.app.get('database');
            
                var newWrite = new database.Board({title:title, writer:writer, content:content});
                newWrite.save(function(err) {
                  if (err) {
                     throw err;
                  }
                  console.log("게시글 추가함.");
            });
                
                 res.redirect('/boardIndex'); 
        }
    });
    
    // 게시글 보기 (get)
    router.route('/boardView').get(function(req, res) {
        console.log('/boardView 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {login_success:false});
        } else {            
                var boardId = req.param('id');
                var database = req.app.get('database');
                    
                database.Board.findOne({_id:boardId}, function(err, board){
                if(err) throw err;
                    board.count += 1;
                    board.save(function(err) {
                      if (err) {
                         throw err;
                      }
                      console.log("조회수 변경");
                    });

                    if(Array.isArray(req.user)){
                        res.render('boardView.ejs', {user: req.user[0]._doc, board:board});
                    }else{
                        res.render('boardView.ejs', {user: req.user, board:board});
                    }
                });
        }
    });
    
    // 게시글 댓글 달기 (post)
    router.route('/boardView').post(function(req, res) {

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
            
        } else {
            console.log('사용자 인증된 상태임.');
                
                var boardId = req.body.boardid;
                var writer = req.body.writer;
                var comment = req.body.comment;
                var date = req.body.date;
            
                console.log(comment);
                console.log(boardId);
                
                console.log(boardId+"게시글 댓글 달기");
            
                var database = req.app.get('database');
                
                var board = new database.Board();
                database.Board.findOne({_id:boardId}, function(err, board){
                if(err) throw err;
                   
                    board.comments.push({writer:writer, contents:comment});
                    board.save(function(err) {
                      if (err) {
                         throw err;
                      }
                      console.log("댓글 추가함.");
                    });
                });
                
                 res.redirect('/boardView?id='+boardId); 
        }
    });
    
    // 게시글 수정하기 (get)
    router.route('/boardEdit').get(function(req, res) {
        console.log('/boardEdit 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {login_success:false});
        } else {            
                var boardId = req.param('id');
                console.log(boardId+"게시글 수정");

                var database = req.app.get('database');
                    
                database.Board.findOne({_id:boardId}, function(err, board){
                if(err) throw err;

                    if(Array.isArray(req.user)){
                        res.render('boardEdit.ejs', {user: req.user[0]._doc, board:board});
                    }else{
                        res.render('boardEdit.ejs', {user: req.user, board:board});
                    }
                });
        }
    });
    
    // 게시글 수정하기 (post)
    router.route('/boardEdit').post(function(req, res) {
        console.log('/boardEdit 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
            
        } else {
            console.log('사용자 인증된 상태임.');
                
                var boardId = req.body.boardid;
                var title = req.body.title;
                var content = req.body.content;
                var updatedAt = req.body.updatedAt;
                
                console.log(boardId+" 게시글 수정");
            
                var database = req.app.get('database');
                
                var board = new database.Board();
                database.Board.findOne({_id:boardId}, function(err, board){
                if(err) throw err;
                    moimId = board.moim_id;
                    board.title=title;
                    board.content=content;
                    board.updatedAt=updatedAt;
            
                board.save(function(err) {
                  if (err) {
                     throw err;
                  }
                  console.log("게시글 추가함.");
                });
                });
                
                 res.redirect('/boardView?id='+boardId); 
        }
    });
    
    // 답안 등록 화면
    router.route('/answer').get(function(req, res) {
        console.log('/answer 패스 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            
            var database = req.app.get('database');
            var Original = new database.Image();

            database.Image.find({}).sort({_id:-1}).exec(function(err, image){
                if(err) throw err;
                
            database.Result.find({}).sort({_id:-1}).exec(function(err, result){
                if(err) throw err;

            if (Array.isArray(req.user)) {
                res.render('answer.ejs', {user: req.user[0]._doc, image:image, result:result});
            } else {
                res.render('answer.ejs', {user: req.user, image:image, result:result});
            }
                
            });
            });
        }
    });
    
    // 내 답안지 (get)
    router.route('/myUpload').get(function(req, res) {
        console.log('/myUpload 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {login_success:false});
        } else {            

                var database = req.app.get('database');            
                    
                database.Image.find({}).sort({_id:-1}).exec(function(err, image){
                if(err) throw err;
                    

                    if(err) throw err;

                    if(Array.isArray(req.user)){
                        res.render('myUpload.ejs', {user: req.user[0]._doc, image:image});
                    }else{
                        res.render('myUpload.ejs', {user: req.user, image:image});
                    }
               
                });
        }
    })
    
    // 내 결과지 (get)
    router.route('/myResult').get(function(req, res) {
        console.log('/myResult 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {login_success:false});
        } else {            

                var database = req.app.get('database');            
                    
                database.Image.find({}).sort({_id:-1}).exec(function(err, image){
                if(err) throw err;
                    

                    if(err) throw err;

                    if(Array.isArray(req.user)){
                        res.render('myResult.ejs', {user: req.user[0]._doc, image:image});
                    }else{
                        res.render('myResult.ejs', {user: req.user, image:image});
                    }
               
                });
        }
    })
    
    // 로그아웃
    router.route('/logout').get(function(req, res) {
        console.log('/logout 패스 요청됨.');
        req.logout();
        res.redirect('/');
    });

    // 로그인 인증
    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect : '/home', 
        failureRedirect : '/login', 
        failureFlash : true 
    }));

    // 회원가입 인증
    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect : '/', 
        failureRedirect : '/signup', 
        failureFlash : true 
    }));
};