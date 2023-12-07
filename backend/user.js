const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next()

    this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET)
}


const User = mongoose.model('User', userSchema)
module.exports = User

