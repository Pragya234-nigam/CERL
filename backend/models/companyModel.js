const {Schema, model} =require('../connection');
const mySchema=new Schema({
    name:String,
    email:{type:String,required:true},
    password:{type:String, required:true},
    confirmPassword:{type:String, required:true},
    description:{type:String,default:"No description provided"},
    country:{type:String,default:"Not specified"},
    state:{type:String,default:"Not specified"},
    city:{type:String,default:"Not specified"},
    contactNo:{type:String,default:"Not specified"},
    establishedDate:{type:Date,default:Date.now},
     createdAt:{type:Date,default:Date.now}
});

module.exports=model('company',mySchema);