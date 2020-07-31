var mongoose = require('mongoose');

var Schema = {};

Schema.createSchema = function(mongoose) {

var ResultSchema = mongoose.Schema({
        user_id:{type:String, default:''}
	    , title: {type: String, default:''}
        , subject: {type:String, dafault:''}
        , page: {type:String, dafault:''}
        , total: {type:Number, default:0}
        , correct: {type:Number, default:0}
        , incorrect: {type:Number, default:0}
	});
    
   console.log('ResultSchema 정의함.');

    return ResultSchema;
    
}

module.exports = Schema;