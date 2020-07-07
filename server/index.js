const express = require("express");
const request = require('request');
const cors = require("cors")
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const fs = require("fs");
const util = require("util");
const fs_writeFile = util.promisify(fs.writeFile);
const fs_readFile = util.promisify(fs.readFile);
const mongoose = require("mongoose");
const routes = require("./routes/app");
const userRoutes = require("./routes/userRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const forumRoutes = require("./routes/forumRouter");
const jwtAuthRoutes = require("./routes/jwtAuthRoute");
const studyPlanRoutes = require("./routes/studyPlanRoutes");
const studyPlanItemRoutes = require("./routes/studyPlanItemRoutes");
const commentRoutes = require("./routes/commentRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");
const auth = require("./auth");
const app = express();


const corsOptions = {
  origin: "http://localhost:3000",
  allowedHeaders : ["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"],
  credentials : true,
  methods: ["GET","PUT","POST","DELETE","HEAD","OPTIONS","PATCH"]
}


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(cookieParser());

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

mongoose
  .connect(
    `mongodb://Mab:51263@test-project-shard-00-00-l0t1l.mongodb.net:27017,test-project-shard-00-01-l0t1l.mongodb.net:27017,test-project-shard-00-02-l0t1l.mongodb.net:27017/Forum-topics?ssl=true&replicaSet=test-project-shard-0&authSource=admin&retryWrites=true&w=majority`,
  )
  .then(() => console.log("DB connected"));

app.post("/compile", async (req, res) => {
  const data = JSON.parse(req.body);
  await fs_writeFile("javaTest.java", data.code);
  exec(`javac javaTest.java`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      res.status(500).send(error.message);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      res.status(500).send("Something went wrong");
    } else {
      res.status(200).send("Code compiled, running ...");
    }
  });
});

app.get("/run", async (req, res) => {
  console.log("Running code ...");
  const childProcess = require("child_process").spawn("java", ["javaTest"]);
  let output = "";

  childProcess.stdout.on("data", (data) => {
    output += data.toString();
    console.log(output);
  });

  childProcess.stderr.on("data", function (data) {
    console.log(data);
    output += data.toString();
  });

  childProcess.on("close", (code) => {
    console.log(`Child process exited with code ${code}`);
    output = output.replace(/(?:\r\n|\r|\n)/g, "<br>");
    res.status(200).send(output);
  });
});

app.get('/data/:id',(req,res)=>{
  console.log(req.params.id);
  let c = req.params.id;
  //console.log(c);
    request(`https://clist.by:443/api/v1/contest/?resource__id=${c}&start__gte=2020-1-4T00%3A00%3A00&order_by=-start&username=mab&api_key=16f0b8a357675130b0756dc337fe50bb76753053`,
     function (error, response, body) {
         res.send(body)
    });  
});

mongoose.Promise = global.Promise;

app.use("/auth", jwtAuthRoutes);
app.use("/user", userRoutes);
app.use("/studyplan",auth.verifyAuthentication,studyPlanRoutes);
app.use("/studyplanitem", auth.verifyAuthentication,studyPlanItemRoutes);
app.use("/youtube",auth.verifyAuthentication,youtubeRoutes);
app.use("/", auth.verifyAuthentication, routes);
app.use("/feedback", auth.verifyAuthentication, feedbackRoutes);
app.use("/",  auth.verifyAuthentication, forumRoutes);
app.use("/" , auth.verifyAuthentication, commentRoutes);
//error handling
app.use(function (err, req, res) {
  console.log("SOMETHING WENT WRONG-------")
  res.status(403).sned({error: err});
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000 ------");
});
