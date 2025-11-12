const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type:String,
      required: true,
      unique: true,
      trim: true, 
      maxlength: [50, 'Category name cannot be more than 50 characters'] },
    
    slug: {
        type: String,
        required: true,
        unique: true
    },
  
    date: {
        type: Date,
        default: Date.now
    }
  }
);
  
module.exports = mongoose.model('Category', categorySchema);