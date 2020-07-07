const express = require('express');
const CommentRouter = express.Router();
const Review = require('../models/Review');
const Topic = require('../models/newtopic');

CommentRouter.get('/reviews', (req, res, next) => {
    Review.find({}).then(function(comment) {
        res.send(comment);
    })
    .catch(next);
})
CommentRouter.post('/topics/:id', (req, res, next) => {
    console.log(req.body);
    Review.create(req.body)
    .then(function(dbReview) {
        return Topic.findByIdAndUpdate({_id: req.params.id}, {$push: {comm: dbReview._id}}, {new:true});
    })
    .then(function(comment){
        res.send(comment);
    })
    .catch(next);
});

module.exports = CommentRouter;