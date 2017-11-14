// Requires and libs set
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController

/**
 * Controls the bot conversation and responses
 */
module.exports = class ConversationController extends TelegramBaseController {
    /**
     * Handler used to say hello as '/start'
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
            'é só mandar um /remind que eu lembro todo mundo.'
        )
    }

    /**
     * Handler used to respond to bot direct mentions
     * @param {Scope} $
     */
    mentionHandler($) {
        console.log($._message)

        var message = 'Olá @' + $._message._from._username
        $.sendMessage(message + '. Não sou muito de conversar ainda...')
    }

    /**
     * Return handlers as commands
     */
    get routes() {
        return {
            'startCommand': 'startHandler',
            'mentionCommand': 'mentionHandler'
        }
    }
}