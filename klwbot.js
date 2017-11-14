'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const tg = new Telegram.Telegram('469233334:AAGQVvt62SQt8BQPEikJQ48RqwS6fD_WErw', {
    webAdmin: {
        port: 8081,
        host: 'localhost'
    }
})

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
    .when(
        new TextCommand('ping', 'pingCommand'),
        new PingController()
    ).otherwise(new OtherwiseController())