// Requires and libs set
const KlwbotBaseController = require('./KlwbotBaseController')
const User = require('../models/User')
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
        let messages = Message.findWhere((message) => {
            return message.from.id === this.user.id
        })

        $.sendMessage('Tudo que eu lembro que você me mandou foi isso:')
        messages.forEach((message) => {
            $.sendMessage(message)
        })
    }

    /**
     * Dumps the entire database to user as Json
     * @param {Scope} $ 
     */
    dbHandler($) {
        $.sendMessage('A base está assim:')
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