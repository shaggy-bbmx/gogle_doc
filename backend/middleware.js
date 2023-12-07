const jwt = require('jsonwebtoken')


const isAuth = async (req, res, next) => {
    const { token } = req.cookies

    try {
        const isValid = await jwt.verify(token, 'CATISMOUSE')
        next()
    } catch (error) {
        res.status(400).json({ auth: false })
    }
}


module.exports = isAuth