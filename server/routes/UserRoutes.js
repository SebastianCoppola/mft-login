const express = require('express')

const { 
    getAllUsers, 
    getUser, 
    register, 
    login, 
    logout, 
    editPassword, 
    sendLoginCode, 
    validateLoginCode, 
    sendRecoveryCode,
    validateRecoveryCode,
    decodeToken 
} = require('../controllers/UserController')

const app = express.Router() 

//GET:
app.get("/all", getAllUsers)
app.get("/:id", getUser)

//REGISTER:
app.post("/register", register)

//LOGIN & LOGOUT:
app.post("/login", login)
app.post("/logout", logout)

//LOGIN CODE:
app.post("/send-login-code", sendLoginCode)
app.post("/validate-login-code", validateLoginCode)

//RECOVERY CODE:
app.post("/send-recovery-code", sendRecoveryCode)
app.post("/validate-recovery-code", validateRecoveryCode)

//EDIT PASSWORD:
app.post("/edit-password", editPassword)

//DECODE TOKEN:
app.post("/decode-token", decodeToken)

module.exports = app