'use strict'

const token = process.env.TOKEN

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const tg = new Telegram.Telegram(token, {
    workers: 1,
    webAdmin: {
        port: 8081,
        host: '0.0.0.0'
    }
})

if(process.env.NODE_ENV === 'production') {
    tg.setWebHook(process.env.HEROKU_URL + tg.token)
}

class PingController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    pingHandler($) {
        console.log($)
        $.sendMessage('pong')
    }

    get routes() {
        return {
            'pingCommand': 'pingHandler'
        }
    }
}

class OtherwiseController extends TelegramBaseController {
    handle() {
        console.log('otherwise')
    }
}

tg.router
    .when(new TextCommand('ping', 'pingCommand'), new PingController())
    .otherwise(new OtherwiseController())