// Requires and libs set
const KlwbotBaseController = require('./KlwbotBaseController')
const Message = require('../models/Message')

/**
 * Used to be extended by other Controllers
 */
module.exports = class AdminController extends KlwbotBaseController {
    /**
     * Handler responsible for user messages history (to the bot only)
     * @param {Scope} $ 
     */
    userHistoryHandler($) {
        let parts = $.message.text.split(' ')
        let options = {
            user: this.user
        }

        if (parts.length > 1) {
            parts.forEach((part, i) => {
                if (i > 0) {
                    let op = part.split(':')
                    options[op[0]] = op[1]
                }
            })
        }

        // Query
        let messages = Message.findWhere((message) => {
            let results = []
            Object.keys(options).forEach((key, i) => {
                if (i > 0) {
                    console.log(key, message[key], options[key])
                    console.log(message)
                    if ((message[key] !== undefined) && (typeof options[key] === 'string')) {
                        results.push(message[key].includes(options[key]))
                    } else {
                        results.push(message[key] === options[key])
                    }
                }
            })
            console.log(results)

            let res = true
            results.forEach((result) => {
                res = res && result
            })

            return res
        })

        if (messages.length > 0) {
            $.sendMessage('Tudo que eu lembro que você me mandou foi isso, @' + this.user.username + ':')
            messages.forEach((message) => {
                $.sendMessage(message)
            })
        } else {
            $.sendMessage('Não encontrei nada, @' + this.user.username + '.')
        }
    }

    /**
     * Dumps the entire database to user as Json
     * @param {Scope} $ 
     */
    dbHandler($) {
        $.sendMessage('A base está assim, @' + this.user.username + ':')
        $.sendMessage(this.database.export('json', 2))
    }

    /**
     * Return handlers as commands
     */
    get routes() {
        return {
            'dbCommand': 'dbHandler',
            'userHistoryCommand': 'userHistoryHandler'
        }
    }
}