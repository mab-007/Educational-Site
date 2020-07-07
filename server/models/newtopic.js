const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewTopic = new Schema({
    title: {
        type: String,
        required: [true, "A title must be provide"],
    },
    
    content : {
        type: String,
        required: [true, "This field can't be empty"],
    },

    author: {
        type: String,
        default: "A3 Group 1"
    },
    
    date: {
        type: Date,
        required: [true, "Date is required"],
    },

    comm: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
      }],
});

const Topic = mongoose.model('topic',NewTopic);

module.exports = Topic;