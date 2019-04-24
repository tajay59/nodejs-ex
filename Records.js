const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);


//============ Create Schema =========================
var rpmSchema = new mongoose.Schema({
    name:{type: String,default:"real"},
    temperature:{type:Number, default:32},
    bpm:{type:Number, default:32},
    orientation:{type: String, default:"No Orientation"},

});

var rpm = mongoose.model('rpm',rpmSchema);
module.exports = rpm;
