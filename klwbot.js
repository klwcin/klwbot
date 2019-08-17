// Get Token from env
const token = process.env.TOKEN

// Requires and libs set
const Telegram = require('telegram-node-bot')
const TextCommand = Telegram.TextCommand
const RegexpCommand = Telegram.RegexpCommand

// Get database and models
const Database = require('./dataMappings')

// Get controllers
const ErrorHandlerController = require('./controllers/ErrorHandlerController')
const ConversationController = require('./controllers/ConversationController')
const CronController = require('./controllers/CronController')
const LocationController = require('./controllers/LocationController')
const AdminController = require('./controllers/AdminController')

// Get Extensions
const CorrectMenuScopeExtension = require('./extensions/CorrectMenuScopeExtension')

// Create the bot
const tg = new Telegram.Telegram(token, {
    workers: 1
})

// Create controllers instaces
const conversation = new ConversationController(Database)
const location = new LocationController(Database)
const cron = new CronController(Database)
const err = new ErrorHandlerController(Database)
const admin = new AdminController(Database)

// Create routes
tg.router
    // Conversation with the bot
    .when(new TextCommand('/start', 'startCommand'), conversation)
    .when(new TextCommand('/help', 'helpCommand'), conversation)
    .when(new TextCommand('/hour', 'hourCommand'), conversation)
    .when(new TextCommand('/toast', 'toastCommand'), conversation)
    .when(new TextCommand('/search', 'searchCommand'), conversation)
    .when(new RegexpCommand(/^[^\/]*@klwbot/g, 'mentionCommand'), conversation)

    // Location related commands
    .when(new TextCommand('/place', 'placeCommand'), location)
    .when(new TextCommand('/me', 'meCommand'), location)

    // Cron jobs related
    .when(new RegexpCommand(/\/remind/g, 'cronCommand'), cron)
    .when(new TextCommand('/stop', 'stopCommand'), cron)

    // Admin features
    .when(new TextCommand('/db', 'dbCommand'), admin)
    .when(new TextCommand('/myhistory', 'userHistoryCommand'), admin)

    // Used to handle errors
    .otherwise(err)

// Add custom Scope extension
tg.addScopeExtension(CorrectMenuScopeExtension)