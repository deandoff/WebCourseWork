require('dotenv').config()
const express = require('express')
const hbs = require('hbs')
const sequelize = require('./db')
const cookieParser = require('cookie-parser');
const models = require('./models/models')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandling')
const path = require('path');

const port = process.env.PORT || 3000

const app = express()

app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, 'views')));

hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

app.use(cookieParser());
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/', router)

app.get('/', (req, res) => {
    return res.redirect('/home');
})

app.use(errorHandler)

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