// Get the database lib
const Bhdr = require('bhdr2').Bhdr

// Get models
const User = require('./models/User')
const Message = require('./models/Message')

// Create the 'Database'
const pool = new Bhdr(this)

// Map models
pool.map(User, Message)

// Exports the database
module.exports = pool