// Get the database lib
const Bhdr = require('bhdr2')

// Get models
const User = require('./models/User')
const Chat = require('./models/Chat')
const MediaData = require('./models/MediaData')
const Message = require('./models/Message')

// Create the 'Database'
const pool = new Bhdr(this)

// Map models
pool.map(User, Chat, MediaData, Message)

// Exports the database
module.exports = pool