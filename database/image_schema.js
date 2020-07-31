var mongoose = require('mongoose');

var Schema = {};

Schema.createSchema = function(mongoose) {

var ImageSchema = mongoose.Schema({
    fileName: {type : String},
    path:  { type: String },
    createdAt : {type:Date, default:Date.now()}
});
     
    console.log('ImageSchema 정의함.');

    return ImageSchema;
}

module.exports = Schema;