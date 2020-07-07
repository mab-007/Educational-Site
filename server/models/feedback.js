const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.set("useFindAndModify", false);
const feedbackSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Content is needed"],
    },

    rating: {
      type: Number,
      required: [true, "Rating value is needed"],
    },

    articleID: {
      type: String,
      required: [true, "Article Id is needed"],
    },
    userID : {
      type: String,
      required : [true, "User ID must be specified."]
    }
  },

  { strict: false },
);

const Feedback = mongoose.model("feedback", feedbackSchema);

module.exports = Feedback;
