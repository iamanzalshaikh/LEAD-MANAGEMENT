import express from "express"
import { getCurrentUser } from "../controller/userController.js"
import isAuth from "../middleware/isAuth.js"



let userRouter = express.Router()

userRouter.get("/getCurrentUser", isAuth, getCurrentUser)



export default userRouter

