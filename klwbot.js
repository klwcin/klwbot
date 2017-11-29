// Get Token from env
const token = process.env.TOKEN

// Requires and libs set
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const RegexpCommand = Telegram.RegexpCommand

// Get controllers
const ErrorHandlerController = require('./controllers/ErrorHandlerController')
const ConversationController = require('./controllers/ConversationController')
const CronController = require('./controllers/CronController')
const MeetingController = require('./controllers/MeetingController')

// Get Extensions
const CorrectMenuScopeExtension = require('./extensions/CorrectMenuScopeExtension')

// Create the bot
const tg = new Telegram.Telegram(token)

// Create controllers instaces
const conversation = new ConversationController()
const meeting = new MeetingController()
const cron = new CronController()
const err = new ErrorHandlerController()

// Create routes
tg.router
    .when(new TextCommand('/start', 'startCommand'), conversation)
    .when(new TextCommand('/help', 'helpCommand'), conversation)
    .when(new TextCommand('/hour', 'hourCommand'), conversation)
    .when(new TextCommand('/place', 'placeCommand'), meeting)
    .when(new TextCommand('/me', 'meCommand'), meeting)
    .when(new TextCommand('/toast', 'toastCommand'), conversation)
    .when(new TextCommand('/search', 'searchCommand'), conversation)
    .when(new TextCommand('/summary', 'summaryCommand'), conversation)
    .when(new RegexpCommand(/^[^\/]*@klwbot/g, 'mentionCommand'), conversation)
    .when(new RegexpCommand(/\/remind/g, 'cronCommand'), cron)
    .when(new TextCommand('/stop', 'stopCommand'), cron)
    .otherwise(err)

// Add custom Scope extension
tg.addScopeExtension(CorrectMenuScopeExtension)