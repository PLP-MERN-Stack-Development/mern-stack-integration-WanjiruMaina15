const mongoose= require('mongoose');  

const authSchema= new mongoose.Schema(
  {
    username: {type:String, 
        required:true, 
        nique:true, trim:true, 
        maxlength:[50,'Username cannot be more than 50 characters']},
    email: {type:String, 
        required:true, 
        unique:true, trim:true,
         maxlength:[100,'Email cannot be more than 100 characters']},
    password: {type:String,
         required:true, 
         minlength:[6,'Password must be at least 6 characters']},
     user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
    createdAt: {type:Date, 
         default:Date.now},
  }
);
 module.exports= mongoose.model('user',authSchema);



