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
        $.sendMessage(
            'E aí galera? Se for rolar um café, tamos aí, ' + 
            'é só mandar um /remind que eu lembro todo mundo.' +
            'Se precisarem de mim é só me chamar (@klwbot).'
        )
    }

    /**
     * Handler used to respond to bot direct mentions
     * @param {Scope} $
     */
    mentionHandler($) {
        var user = $.message.from.username

        $.sendMessage('Olá @' + user + '. Quais as novas?')
        // Wait for response
        $.waitForRequest.then($ => {
            if ($.message.from.username === user) {
                $.sendMessage('Interessante... mas não sei o que dizer sobre isso.')
            } else {
                $.waitForRequest.then($ => {
                    if ($.message.from.username === user) {
                        $.sendMessage(
                            `Só um momento @${$.message.from.username}` +
                            `vou só responder @${user} rapidinho.`
                        )
                    } else {
                        $.sendMessage('Calem-se! Calem-se! Vocês me deixam looouuuco!')
                    }
                })
            }
        })
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