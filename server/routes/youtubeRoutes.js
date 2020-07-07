
const express = require("express");
const youtubeRouter = express.Router();
const {google} = require("googleapis")


youtubeRouter.get("/", async (req,res,next) => {

    const response = await google.youtube('v3').search.list({
        key : "AIzaSyCryvlw954amqVZ8LQJEhmXQAiVdF-pMrE",
        part : "snippet",
        q : req.query.search,
        order:"viewCount",
        maxResults: 10
    });

    const { data } = response; 
    console.log(data);
    return res.status(200).send(data.items.map(item => {return {...item.snippet,link:"https://youtube.com/video/"+item.id.videoId,videoID:item.id.videoId}}));
})

module.exports = youtubeRouter;