const User = require('../models/UserModel')
require('dotenv').config()
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const { sendValidationCodeEmail, sendRecoveryCodeEmail } = require('../helpers/mailer')

//GET ALL USERS:
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (e) {
        res.status(500).send({message:'Server Error.'})
    }
}

//GET 1 USER:
const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.find({_id: id})
        await res.send(user)
    } catch (e) {
        res.status(500).send({message:'Server Error.'})
    }
}

//REGISTER:
const register = async (req, res) => {
    try{
        const { name, surname, mail, password, phone } = req.body
        if (!validator.matches(name,/^[a-zA-Z ]*$/) || !validator.matches(surname,/^[a-zA-Z ]*$/) || !validator.isEmail(mail)) {
            res.status(400).send({message:'InvalidParams.'})
            return;
        }
        const registeredUser = await User.findOne({mail})
        if (registeredUser) {
            res.status(409).send({message:'This mail has already been registered.'})
            return;
        }
        bcrypt.hash(password, 10, async (err, hash) =>{
            if(err){
                res.status(500).send({message:'Server Error.'})
            }
            const new_user = new User({ name, surname, mail, phone, password: hash, logged: false })
            new_user.save()
            res.status(200).send({ userId: new_user._id, message: 'User Saved.' })
        })
    }catch(err){
        res.status(500).send({ message: 'Server Error.' })    
    }
}

//LOGIN:
const login = async (req, res) => {
    const { mail, password } = req.body
    try{
        const user = await User.find({mail})
        if(user.length === 0){
            res.status(404).send({message:'User does not exist.'})
            return
        }
        const storedPassword = user[0].password
        bcrypt.compare(password, storedPassword,(err,resCompare)=>{
            
            if(err) res.status(500).send({message:'Server Error.'})
            
            if(!resCompare) res.status(401).send({message:'Invalid Password.', mail: mail})

            user[0].logged = true
            user[0].save()

            res.status(200).send({message: 'User logged in.'})
        })
    }catch(e){
        res.status(500).send({message:'Server Error.'})
    }
}

//LOGOUT:
const logout = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    const tokenDecoded = jwt.decode(token, process.env.privateKey)
    try{
        const userLogged = await User.find({mail: tokenDecoded.mail})
        const user = userLogged[0]
        user.logged = false
        user.save()
        res.clearCookie('token')
        res.status(200).send({message:'User logged out.'})
    }catch(e){
        res.status(500).send({message:'Server Error.'})
    }
}

//SEND LOGIN CODE:
const sendLoginCode = async (req, res) => {
    const { mail } = req.body
    const validationCode = Math.random().toString().slice(-5)
    //Save recovery code:
    try{
        const user = await User.find({mail})
        user[0].validationCode = validationCode
        user[0].save()
    }catch(e){
        res.status(500).send({message:'Server Error.'})
    }
    //Callback & Response:
    const mailSuccess = (success) => {
        if (success) res.status(200).send({message:'Email sent.'})
        else res.status(400).send({message:'Error sending email.'})
    }
    //Send mail:
    sendValidationCodeEmail(mail, validationCode, mailSuccess)
}

//VALIDATE LOGIN CODE:
const validateLoginCode = async (req, res) => {
    const { mail, validationCode } = req.body
    try{
        const user = await User.find({mail})
        if (user[0].validationCode === validationCode) {
            user[0].validationCode = null
            user[0].save()
                .then(()=> {
                    const token = jwt.sign({mail}, process.env.privateKey)
                    // res.cookie('token', token, {maxAge: 60 * 60 * 1000})
                    res.status(200).send({token, message: 'User logged in.'})
                })
                .catch(()=>{
                    res.status(500).send({message: 'Server Error.'}) 
                })
        } else {
            res.status(401).send({message: 'Invalid Code.'}) 
        }
    }catch(e){
        res.status(500).send({message:'Server Error.'})
    }
}

//SEND RECOVERY CODE:
const sendRecoveryCode = async (req, res) => {
    const mail = req.body.mail
    const validationCode = Math.random().toString().slice(-5)
    //Save Validation Code:
    try{
        const user = await User.find({mail})
        user[0].validationCode = validationCode
        user[0].save()
    }catch(e){
        res.status(500).send({message:'Server Error.'})
    }
    //Callback Mail & Response:
    const mailSuccess = (success) => {
        if (success) res.status(200).send({message:'Email sent.'})
        else res.status(400).send({message:'Error sending email.'})
    }   
    //Send Mail:
    sendRecoveryCodeEmail(mail, validationCode, mailSuccess)
}

//VALIDATE RECOVERY CODE:
const validateRecoveryCode = async (req, res) => {
    const { mail, validationCode } = req.body
    try{
        const user = await User.find({mail})
        if(user[0].validationCode === validationCode){
            const user = await User.find({mail})
            user[0].validationCode = null
            user[0].save()
            res.status(200).send({message:'Good Code.'})
        }else{
            res.status(401).send({message:'Wrong code.'})
        }
    }catch(e){
        res.status(500).send({message:'Server Error.'})
    }
}

//EDIT PASSWORD:
const editPassword = async (req, res) => {
    const { mail, password } = req.body
    try {
        bcrypt.hash(password, 10, async (err, hash) => {
            if(err) res.status(500).send({message:'Server Error.'})
            const user = await User.find({mail})
            user[0].password = hash
            user[0].save()
            res.status(200).send("Password Updated.")
        })   
    }catch(e){
        res.status(500).send({message:'Server Error.'})
    }
}

//DECODE TOKEN:
const decodeToken = async (req, res) => {
    const {token} = req.body
    const tokenDecoded = jwt.decode(token, process.env.privateKey)
    try{
        const user = await User.find({mail: tokenDecoded.mail})
        res.send(user[0])
    } catch(e){
        return res.status(404).send("Invalid Token.")
    }
}

module.exports = {
    getAllUsers,
    getUser,
    register,
    login,
    logout,
    sendLoginCode,
    validateLoginCode,
    sendRecoveryCode,
    validateRecoveryCode,
    editPassword,
    decodeToken,
}