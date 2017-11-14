// Requires and libs set
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController

/**
 * Used to handle errors
 */
module.exports = class ErrorHandlerController extends TelegramBaseController {
    handle(err) {
        console.log(err)
    }
}