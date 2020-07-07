const express = require("express");
const feedBackRouter = express.Router();
const Feedback = require("../models/feedback");
const Article = require("../models/articles");
const { raw } = require("body-parser");

feedBackRouter.get("/:id", (req, res) => {
  console.log(req.params.id);
  Feedback.findOne({ _id: req.params.id }).then((data) => {
    console.log(data);
    res.send(data);
  });
});
feedBackRouter.get("/article/:id", (req, res) => {
  const query  = {articleID : req.params.id}
  Feedback.find(query).then((data) => {
    console.log(data);
    res.send(data);
  });
});

feedBackRouter.post("/", async (req, res) => {
  if (!req.body || !req.body.articleID || !req.body.rating === null || !req.body.rating instanceof Number || req.body.rating > 5.0 || req.body.rating<0) {
    res.send(403, {message:"Rating must be a valid number"});
    return;
  }
  let rawResult ;
  try{
    rawResult = await Feedback.findOneAndUpdate({userID:req.body.userID,articleID:req.body.articleID}, {...req.body},{upsert:true,rawResult:true});

  }catch(e){
    return res.send(500,{message:" Something went wrong"})
  }
  //const data = await Feedback.create({ ...req.body });
  const data = req.body;

  console.log(rawResult, ' ---------------------------------------------- ',data);
  const articleID = data.articleID;
  const rating = req.body.rating;
  


  const article = await Article.findOne({ _id: articleID });

  console.log(article.numRatings, " ", article.numRatings instanceof Number , " ",Number(article.numRatings ? article.numRatings : 0));
  console.log(rawResult.lastErrorObject.updatedExisting?0:1);

  const newRating = !rawResult.lastErrorObject.updatedExisting;

  const numRatings =  Number(article.numRatings ? article.numRatings : 0) + Number(newRating?1:0);
  console.log(numRatings, " ----------", newRating)

  const avgRatingOld = article.avgRating ? Number(article.avgRating) : 0;

  let avgRating;

  if(newRating){
    avgRating = (avgRatingOld * (numRatings - 1) + rating) / numRatings ;
    console.log("new Feedback ", avgRating)
  }else{
    avgRating = ((avgRatingOld * (numRatings)+(rating - rawResult.value.rating))/numRatings);
    console.log("Updating feedback, ", avgRating , " ", rating - rawResult.value.rating)
  }

  console.log(
    numRatings,
    " ",
    avgRatingOld,
    " ",
    numRatings - 1,
    " ",
    avgRatingOld * (numRatings - 1) + rating,
  );

  const patchResponse = await Article.findOneAndUpdate(
    { _id: articleID },
    { numRatings, avgRating },
  );

  res.send(data);
});

module.exports = feedBackRouter;
