const express = require("express");
const studyPlanRouter = express.Router();

const StudyPlan = require("../models/studyplan");
const StudyPlanItem = require("../models/studyplanitem");

studyPlanRouter.get("/:id", (req,res,next)=>{
    console.log(req.params.id, " searching for study plan");
    StudyPlan
    .findOne({_id: req.params.id})
    .then(data=>res.send(data));
})

studyPlanRouter.post("/", async (req,res,next) => {
    const data = await StudyPlan.create({...req.body});
    console.log("Created new study plan ", data);
    res.send(data);
})


studyPlanRouter.put("/",(req,res,next)=>{

    const query = { _id : req.body._id};

    const newData = req.body;
    delete newData._id;

    StudyPlan.findOneAndUpdate(query,newData, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.send('Succesfully saved.');
    })
})

studyPlanRouter.get("/:id/studyPlanItems" , (req,res,next) => {
    const query = {studyPlanID : req.params.id};
    StudyPlanItem.find(query,(err,doc)=>{
        if(err) return res.send(500, {error:err})
        return res.send(doc)
    })

})

studyPlanRouter.get("/user/:id", (req,res,next) => {
    const query = { members: req.params.id }
    StudyPlan.find(query).then(data=>res.send(data));
})
module.exports = studyPlanRouter;