const mongoose = require('mongoose')
const config = require('../config')

mongoose
    .connect(`mongodb://${config.db_host}/${config.db_name}`)
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db
