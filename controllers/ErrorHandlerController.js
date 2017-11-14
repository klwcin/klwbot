// Requires and libs set
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController

/**
 * Used to handle errors
 */
module.exports = class ErrorHandlerController extends TelegramBaseController {
    /**
     * All that is not defined goes to the log
     * @param {Scope} $
     */
    handle($) {
        // All the not implemented is considered an error
        console.log($)
    }
}