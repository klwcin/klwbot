// Requires and libs set
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const User = require('../models/User')
const Message = require('../models/Message')

/**
 * Used to be extended by other Controllers
 */
module.exports = class KlwbotBaseController extends TelegramBaseController {
    constructor(database) {
        super()
        this.database = database
    }

    /**
     * All Messages goes to the history
     * @param {Scope} $
     */
    saveUserAndMessageHistory($) {
        var user = User.find({
            username: $.message.from.username
        })

        if (!user) {
            user = new User($.message.from).save()
        }

        new Message($.message).save()
        return user
    }

    /**
     * All that is not defined goes to the log
     * @param {Scope} $
     */
    handle($) {
        this.saveUserAndMessageHistory($)

        // All the not implemented is considered a log entry
        console.log($)
    }

    dbHandler($) {
        this.saveUserAndMessageHistory($)
        $.sendMessage(this.database.export('json', 2))
    }

    /**
     * Return handlers as commands
     */
    get routes() {
        return {
            'dbCommand': 'dbHandler'
        }
    }
}