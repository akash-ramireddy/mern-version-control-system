const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const userRouter = require("../routes/user.router");
const dotenv = require("dotenv");
dotenv.config();

let client;
const connectClient = async ()=> {
    if(!client) {
        client = new MongoClient(process.env.MONGODB_URI);
    }
    await client.connect();
}

const signup = async (req,res) => {
    let {username,email,password}=req.body;
    try{
        connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({username});
        if(user){
            return res.status(400).json({message:"User already exists!"});
        }
        let salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = {
            username,
            email,
            password:hashedPassword,
            repositories: [],
            followedUsers: [],
            starRepos: []
        }
        const result = await usersCollection.insertOne(newUser);

        const token = jwt.sign({ id:result.insertedId },process.env.JWT_SECRET_KEY,{ expiresIn: "1h" });
        res.send(token);
    }
    catch(err){
        console.log("Error during the signUp: ",err);
        res.status(500).send("Server error");
    }
};

const login = (req,res) => {

};

const getAllUsers = (req,res) => {

};

const getUserProfile = (req,res) => {

};

const updateUserProfile = (req,res) => {

};

const deleteUserProfile = (req,res) => {

};

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};