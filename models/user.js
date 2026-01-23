const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    age:Number,
    name:String,
    profilepic:{
        type:String,
        default:'default.png'
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'post'
        }
    ]
});




module.exports=mongoose.model('user',userSchema);
