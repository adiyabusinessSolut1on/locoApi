const mongoose = require('mongoose');
const { Schema } = mongoose;


const BlogSchema = new Schema({
  title: { type: String, required: true },
  slug:{type:String,require:true},
  thumnail: {type:String,require:true}, 
  content:{type:String,require:true}
},
{timestamps:true});

const Blog = mongoose.model('blog', BlogSchema);

module.exports = Blog;
