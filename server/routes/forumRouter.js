const express = require('express');
const Forumrouter = express.Router();
const Topic = require('../models/newtopic');


Forumrouter.get('/topics', (req, res, next) => {
    Topic.find({}).then(function(topic){
        res.send(topic);
    })
    .catch(next);
});

Forumrouter.get("/topics/:id", function(req, res, next){
    Topic.findOne({_id: req.params.id})
    .then(function(topic) {
        res.send(topic)
    })
    .catch(next);
});

Forumrouter.post('/topics', (req, res, next) => {
    console.log(req.body);
    Topic.create({
        ...req.body,
        date: new Date()
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, "/"),
    })
    .then(function(topic){
        res.send(topic);
    })
    .catch(next);
    
});


module.exports = Forumrouter;