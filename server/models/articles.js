const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema
const ArticleSchema = new Schema({
  title: {
    type: String,
    required: [true, "A title must be provided"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  author: {
    type: String,
    default: "A3 Group 1",
  },
  content: {
    type: Object,
    required: [true, "Content cant be empty "],
  },
  numRatings: {
    type: Number,
  },
  avgRating: {
    type: Number,
  },
  tags : {
    type : [String]
  }
});

const Article = mongoose.model("article", ArticleSchema);

module.exports = Article;
