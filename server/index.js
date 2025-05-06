require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')

const port = process.env.PORT || 3000

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({message: 'Hello'})
})

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

start()