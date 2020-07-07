const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//mongoose.set("useFindAndModify", false);

const studyPlanSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is mandatory"]
    },
    createdBy: {
        type: String,
        required: [true, "Must specify creator email"]
    },
    description: {
        type: String,
        required: [true, "Must specify a description"]
    },
    studyPlanItems: {
        type: [String],
    },
    members: {
        type: [String]
    }
})

const StudyPlan = mongoose.model("studyPlan", studyPlanSchema);

module.exports = StudyPlan