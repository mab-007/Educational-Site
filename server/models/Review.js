var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  author:{
    type: String,
    required: true
  },
  comm: {
    type: String,
    required: true
  }
});

var Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;