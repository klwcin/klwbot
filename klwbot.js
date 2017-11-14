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

// Create the bot
if(process.env.NODE_ENV === 'production') {
    // Production (Heroku)
    const tg = new Telegram.Telegram(token, {
        webAdmin: {
            port: 80,
            host: '0.0.0.0'
        },
        webhook: {
            url: process.env.HEROKU_URL,
            port: process.env.PORT,
            host: '0.0.0.0'
        }
    })

    // Create routes
    tg.router
        .when(new TextCommand('/start', 'startCommand'), new ConversationController())
        .when(new RegexpCommand(/^[^\/]*@klwbot/g, 'mentionCommand'), new ConversationController())
        .when(new TextCommand('/remember', 'cronCommand'), new CronController())
        .otherwise(new ErrorHandlerController())
} else {
    // Development
    const tg = new Telegram.Telegram(token, {
        workers: 1,
        webAdmin: {
            port: 80,
            host: '0.0.0.0'
        }
    })

    // Create routes
    tg.router
        .when(new TextCommand('/start', 'startCommand'), new ConversationController())
        .when(new RegexpCommand(/^[^\/]*@klwbot/g, 'mentionCommand'), new ConversationController())
        .when(new TextCommand('/remind', 'cronCommand'), new CronController())
        .otherwise(new ErrorHandlerController())
}