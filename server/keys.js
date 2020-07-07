const fs = require("fs")
module.exports={
    PRIVATE_KEY : fs.readFileSync("./privateKey.key"),
    PUBLIC_KEY: fs.readFileSync("./publicKey.key"),
}