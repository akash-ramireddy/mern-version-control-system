const express = require("express");
const userController = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/allUsers",userController.getAllUsers);
userRouter.post("/signup",userController.signup);
userRouter.post("/login",userController.login);
userRouter.get("/getUserProfile",userController.getUserProfile);
userRouter.put("/updateUserProfile",userController.updateUserProfile);
userRouter.delete("/deleteUserProfile",userController.deleteUserProfile);

module.exports = userRouter;