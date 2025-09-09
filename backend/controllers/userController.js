const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId, ReturnDocument } = require("mongodb");
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
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({username});
        if(user){
            return res.status(400).json({message:"User already exists!"});
        }
        const salt = await bcrypt.genSalt(10);
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

const login = async (req,res) => {
    let { email,password } = req.body;
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ email });
        if(!user){
            return res.status(400).json({message:"Invalid credientials!"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credientials!"});
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
        res.json({token,userId:user._id});
    }
    catch(err) {
        console.error("Error during login: ",err.message);
        res.status(500).send("Server Error!");
    }
};

const getAllUsers = async (req,res) => {
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");
        const users = await usersCollection.find({}).toArray();
        res.json(users);
    }
    catch (err) {
        console.error("Error during login: ",err.message);
        res.status(500).send("Server Error!");
    }
};

const getUserProfile = async (req,res) => {
    let {id} = req.params;
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({_id: new ObjectId(id)});
        if(!user){
            return res.status(400).json({message:"User not found!"});
        }
        res.json(user);
    }
    catch (err) {
        console.error("Error during login: ", err.message);
        res.status(500).send("Server Error!");
    }
};

const updateUserProfile = async (req,res) => {
    let { id } = req.params;
    let { email,password } = req.body;
    try{
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ email });
        if(user && user._id.toString() != id){
            return res.status(400).json({message:"User already exists!"});
        }
        let updateFields = {email};
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            updateFields.password = hashedPassword;
        }
        const result = await usersCollection.findOneAndUpdate(
            { _id : new ObjectId(id) },
            { $set:updateFields },
            { returnDocument : "after" , returnOriginal: false },
        );
        if (!result) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json(result);
    }
    catch(err) {
        console.error("Error during updating: ", err.message);
        res.status(500).send("Server Error!");
    }
};

const deleteUserProfile = async (req,res) => {
    let {id} = req.params;
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");
        let result=await usersCollection.deleteOne({ _id:new ObjectId(id) });
        if(result.deleteCount==0){
            return res.status(404).json({ message: "User not found!" });
        }
        res.json({ message: "User Profile Deleted!" });
    }
    catch (err) {
        console.error("Error during deletion: ", err.message);
        res.status(500).send("Server Error!");
    }
};

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};