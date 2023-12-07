const mongoose = require('mongoose')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const cors = require('cors')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const isAuth = require('./middleware')
const dotenv = require('dotenv')
dotenv.config({ path: "./config/config.env" })
const path = require('path')



server.listen(process.env.PORT, () => { console.log('server is UP and runing') })

mongoose.connect(process.env.DB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB  is OK'))
    .catch(error => console.log(error.message))

const Document = require('./model')
const User = require('./user')


app.use(cors())
app.use(express.json())
app.use(cookieParser())


app.get('/docs', isAuth, async (req, res) => {
    try {
        const docs = await Document.find()
        if (!docs) res.status(301).json({ message: 'empty' })
        res.status(200).json({ docs })
    } catch (error) {
        res.status(401).json({ message: 'error' })
    }
})

app.delete('/delete/:id', isAuth, async (req, res) => {

    try {
        await Document.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Ok' })
    } catch (error) {
        res.status(400).json({ message: 'error' })
    }


})


app.post('/register', async (req, res) => {
    const { email, password } = req.body

    const user = new User({ email, password })
    try {
        await user.save()
        const token = user.getJwtToken()

        //options for cookie
        const options = {
            httpOnly: true,
        }

        res.status(200).cookie('token', token, options).json({
            user,
            token
        })

    } catch (error) {
        console.log(error)
    }

})


app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = user.getJwtToken()

            //options for cookie
            const options = {
                httpOnly: true,
            }

            res.status(200).cookie('token', token, options).json({
                user,
                token
            })
        } else {
            res.status(401).json({ message: 'Wrong password' })
        }
    } catch (error) {
        res.status(400).json(error)
    }
})

app.get('/isAuth', async (req, res) => {
    const { token } = req.cookies

    try {
        const isValid = await jwt.verify(token, 'CATISMOUSE')
        res.status(200).json({ auth: true })
    } catch (error) {
        res.status(400).json({ auth: false })
    }
})


app.get('/logout', (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({ success: true })

})


app.use(express.static(path.join(__dirname, '../client/build')))
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"))
})

/********************CODE FOR SOCKET.IO BEGINS FROM HERE *********************/

const defaultValue = ''

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})



io.on('connection', socket => {
    console.log('User is connected')

    socket.on('disconnect', () => {
        console.log('User is disconnected')
    })

    socket.on('get-document', async ({ documentId, name }) => {
        const doc = await findOrCreateDocument(documentId, name)
        socket.join(documentId)
        socket.emit('load-document', doc.data)

        socket.on('send-changes', (delta) => {
            console.log(delta)
            socket.broadcast.to(documentId).emit('recieve-changes', delta)
        })

        socket.on('save-document', async (data) => {
            await Document.findByIdAndUpdate(documentId, { data })
        })
    })
})

const findOrCreateDocument = async (id, name) => {
    if (id == null) return
    const doc = await Document.findById(id)
    if (doc) {
        console.log(doc)
        return doc
    }
    return await Document.create({ _id: id, name: name + '.pdf', data: defaultValue })
} 