const jwt = require("jsonwebtoken");
const keys = require("./keys");

const options = {
    expiresIn : 3600,
    algorithm: "HS256"
}

const sign = (payload,customOptions)=>  jwt.sign({payload},keys.PRIVATE_KEY,{...options,...customOptions});
const verify = (token) => jwt.verify(token,keys.PRIVATE_KEY,options);
const decode = (token) => jwt.decode(token, {complete:true});

const jwtAuth = {
    sign,
    verify,
    decode
}
module.exports = jwtAuth;