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
const MeetingController = require('./controllers/MeetingController')
const KlwbotBaseController = require('./controllers/KlwbotBaseController')

// Get Extensions
const CorrectMenuScopeExtension = require('./extensions/CorrectMenuScopeExtension')

// Create the bot
const tg = new Telegram.Telegram(token)

// Create controllers instaces
const conversation = new ConversationController(Database)
const meeting = new MeetingController(Database)
const cron = new CronController(Database)
const err = new ErrorHandlerController(Database)
const klw = new KlwbotBaseController(Database)

// Create routes
tg.router
    .when(new TextCommand('/start', 'startCommand'), conversation)
    .when(new TextCommand('/help', 'helpCommand'), conversation)
    .when(new TextCommand('/hour', 'hourCommand'), conversation)
    .when(new TextCommand('/place', 'placeCommand'), meeting)
    .when(new TextCommand('/me', 'meCommand'), meeting)
    .when(new TextCommand('/toast', 'toastCommand'), conversation)
    .when(new TextCommand('/search', 'searchCommand'), conversation)
    .when(new RegexpCommand(/^[^\/]*@klwbot/g, 'mentionCommand'), conversation)
    .when(new RegexpCommand(/\/remind/g, 'cronCommand'), cron)
    .when(new TextCommand('/stop', 'stopCommand'), cron)
    .when(new TextCommand('/db', 'dbCommand'), klw)
    .otherwise(err)

// Add custom Scope extension
tg.addScopeExtension(CorrectMenuScopeExtension)