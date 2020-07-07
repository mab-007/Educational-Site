const express = require("express");
const userRouter = express.Router();
const User = require("../models/userbio");
const auth = require("../auth")

userRouter.get("/", function (req, res, next) {
  User.find({})
    .then(function (aUser) {
      res.send(aUser);
    })
    .catch(next);
});
userRouter.get("/:id", function (req, res, next) {
  User.findOne({email : req.params.id})
    .then(function (user) {
      if(!user)
        res.status(404).send("User not found!")
      res.send(user);
    })
    .catch(next);
});
userRouter.post("/signup", function (req, res, next) {
  User.findOne({ email: req.body.email })
    .then(function (user) {
      if (user == null) {
        var new_user = new User(req.body);
        new_user.password = new_user.generateHash(new_user.password);
        User.create(new_user).then(function (user) {
          res.send({ statusCode: 220, message: "registration successful" });
        });
      } else {
        res.send({ statusCode: 800, message: "email_id already registered" });
      }
    })
    .catch(next);
});

const validateUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(function (user) {
      if (user == null) {
        res.send({ statusCode: 404, message: "Account not found" });
      } else {
        if (!user.validPassword(req.body.password)) {
          res.send({ statusCode: 450, message: "Incorrect password" });
        } else {
          req.user = user;
          next();
        }
      }
    })
    .catch(next);
}

userRouter.post("/signin", validateUser , (req,res,next) => {
  const jsonWebTokens = auth.createTokens(req.user);
  const response = {
    user : req.user,
    accessToken : jsonWebTokens.accessToken
  }
  res.cookie('refreshToken', jsonWebTokens.refreshToken, { maxAge: 2 * 60 * 60 * 1000 * 1000 });
 // res.setHeader('Set-Cookie', `refreshToken=${jsonWebTokens.refreshToken};httpOnly: false; maxAge=360000`);
  res.send(response);
});

module.exports = userRouter;
