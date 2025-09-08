const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { argv } = require("yargs");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { commitRepo } = require("./controllers/commit");
const { revertRepo } = require("./controllers/revert");
const  mainRouter  = require("./routes/main.router");

dotenv.config();

yargs(hideBin(process.argv))
    .command("start","Starts a new server",{},startServer)
    .command(
        "init",
        "Initialise a new repository",
        {},
        initRepo
    )
    .command(
        "add <file>",
        "Add a file to the repository",
        (yargs)=>{
            yargs.positional("file",{
                describe:"File to add to the staging area.",
                type:"string",
            })
        },
        (argv)=>{
            addRepo(argv.file);
        }
    )
    .command(
        "commit <message>",
        "Commit the staged repository",
        (yargs)=>{
            yargs.positional("message",{
                describe: "Commit message",
                type: "string"
            });
        },
        (argv)=>{
            commitRepo(argv.message);
        }
    )
    .command(
        "pull",
        "Fetch commits from S3",
        {},
        pullRepo
    )
    .command(
        "push",
        "Push commits to S3",
        {},
        pushRepo
    )
    .command(
        "revert <commitID>",
        "Revert to a specific commit",
        (yargs)=>{
            yargs.positional("commitID",{
                describe: "Commit ID to revert to",
                type:"string"
            })
        },
        (args)=>{
            revertRepo(args.commitID);
        }
    )
    .demandCommand(1,"You need atleast one command")
    .help().argv;

function startServer(){
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURI = process.env.MONGODB_URI;

    mongoose
            .connect(mongoURI)
            .then(() => {
                console.log("Connected to MongoDB.");
            })
            .catch((err) => {
                console.log("Error connecting to MongoDB: ",err);
            });
    
    app.use(cors({origin:"*"}));

    app.use("/",mainRouter);

    let user = "test";
    const httpServer = http.createServer(app);
    const io = new Server(httpServer,{
        cors:{
            origin:"*",
            methods:["GET","POST"]
        }
    });

    io.on("connection",(socket)=>{
        socket.on("joinRoom",(userID)=>{
            user = userID;
            console.log("=====");
            console.log(user);
            console.log("=====");
            console.log(userID);
        });
    });

    const db = mongoose.connection;

    db.once("open",async ()=>{
        console.log("CRUD operations called.");
    });

    httpServer.listen(port, ()=>{
        console.log(`Server is running on ${port}`);
    });
}