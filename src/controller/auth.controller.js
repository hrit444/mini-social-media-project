const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

async function registerController(req,res){
  const {username, password} = req.body

  const isExistingUser = await userModel.findOne({username})

  if(isExistingUser){
    return res.status(409).json({
      message: "Username already exists"
    })
  }

  const user = await userModel.create({
    username,
    password: await bcrypt.hash(password,10)
  })

  const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

  res.cookie('token', token)

  res.status(201).json({
    message:"User created successfully",
    user
  })
  
}

async function loginController(req,res) {
  const {username, password} = req.body

  const user = await userModel.findOne({username})

  if(!user){
    return res.status(400).json({
      message: "User not found"
    })
  }

  const isPasswordValid = await bcrypt.compare(password,user.password)

  if(!isPasswordValid){
    return res.status(400).json({
      message: "Invalid password"
    })
  }

  const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
  res.cookie("token",token)
  res.status(200).json({
    message:"User loggedin successfully",
    user:{
      username:user.username,
      id: user._id
    }
  })
}

module.exports = {
  registerController,
  loginController
}