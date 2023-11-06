require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const UserRoutes = require('./routes/UserRoutes')

const app = express()

//WEBSERVER CONFIG
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({credentials: true}))

//WEBSERVER ROUTES
app.use("/user", UserRoutes)

//DB CONNECTION & WEBSERVER CONNECTION
const PORT = process.env.PORT || 5000

mongoose.set('strictQuery', false)

mongoose.connect(process.env.atlasConnection)
    .then(()=>{
        console.log("Connected to mongodb")
    })

app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`)
})
