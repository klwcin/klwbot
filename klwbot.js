// Get Token from env
// require('./token')
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

// Create the bot
const tg = new Telegram.Telegram(token)

// Create routes
tg.router
    .when(new TextCommand('/start', 'startCommand'), new ConversationController())
    .when(new RegexpCommand(/^[^\/]*@klwbot/g, 'mentionCommand'), new ConversationController())
    .when(new TextCommand('/remind', 'cronCommand'), new CronController())
    .otherwise(new ErrorHandlerController())