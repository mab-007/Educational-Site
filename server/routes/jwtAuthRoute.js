const express = require("express")
const jwtAuthRouter = express.Router();
const jwtAuth = require("../jwtAuth");
const auth = require("../auth")

jwtAuthRouter.post("/refresh", (req, res, next) => {
    try {
        const user = jwtAuth.verify(req.cookies["refreshToken"]);
        const jsonWebTokens = auth.createTokens(user.payload);
        res.cookie('refreshToken', jsonWebTokens.refreshToken, { maxAge: 2 * 60 * 60 * 1000 * 1000 });
        //res.setHeader('Set-Cookie', `refreshToken=${jsonWebTokens.refreshToken}; maxAge=360000`);
        res.send({ accessToken: jsonWebTokens.accessToken, user: user.payload })
    } catch (e) {
        res.sendStatus(401).send("Unauthorized Access 4")
    }
})

module.exports = jwtAuthRouter;