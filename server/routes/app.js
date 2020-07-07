const express = require("express");
const router = express.Router();
const Article = require("../models/articles");

router.get("/article", function (req, res, next) {
  Article.find({})
    .then(function (articles) {
      res.send(articles);
    })
    .catch(next);
});
router.get("/article/:id", function (req, res, next) {
  Article.findOne({ _id: req.params.id })
    .then(function (article) {
      res.send(article);
    })
    .catch(next);
});
// router.patch("article/:id",async (req,res)=>{

// })
router.post("/article", function (req, res, next) {
  console.log(req.body)
  Article.create({
    ...req.body,
    date: new Date().toJSON().slice(0, 10).replace(/-/g, "/"),
  })
    .then(function (article) {
      res.send(article);
    })
    .catch(next);
});

module.exports = router;
