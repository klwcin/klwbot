// Requires and libs set
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController

/**
 * Controls the bot conversation and responses
 */
module.exports = class ConversationController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    startHandler($) {
        console.log($._message)
        console.log($._isEditedMessage)
        console.log($._message._from)
        console.log($._message._chat)
        console.log($._message._text)

        $.sendMessage(
            'E aí galera? Se for rolar um café, tamos aí, ' + 
            'é só mandar um /remember que eu lembro todo mundo.'
        )
    }

    /**
     * @param {Scope} $
     */
    mentionHandler($) {
        console.log($._message)

        var message = 'Olá @' + $._message._from._username
        $.sendMessage(message + '. Não sou muito de conversar ainda...')
    }

    get routes() {
        return {
            'startCommand': 'startHandler',
            'mentionCommand': 'mentionHandler'
        }
    }
}