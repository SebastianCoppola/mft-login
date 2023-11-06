const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        name: { type:String , required: true },
        surname: { type:String , required: true }, 
        mail: { type: String , required: true },
        password: { type: String , required: true },
        validationCode: { type: String , required: false },
        logged: Boolean
    },
    {
        timestamps: true
    }
)

const UserModel = mongoose.model('Users', UserSchema)

module.exports = UserModel