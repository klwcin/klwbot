// Requires and libs set
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const User = require('../models/User')
const Message = require('../models/Message')

/**
 * Used to be extended by other Controllers
 */
module.exports = class KlwbotBaseController extends TelegramBaseController {
    /**
     * A Bhdr2 simple pool 'Database'
     * @param {Bhdr2} database 
     */
    constructor(database) {
        super()
        this.database = database
    }

    /**
     * Run before any action
     * @param {Scope} $ 
     */
    before($) {
        // Updates the current user and add the current message to history
        this.user = this.saveUserAndMessageHistory($)
        return $
    }

    /**
     * All Messages goes to the history
     * @param {Scope} $
     */
    saveUserAndMessageHistory($) {
        let user = User.find({
            username: $.message.from.username
        })

        if (!user) {
            user = new User($.message.from).save()
        }

        new Message($.message).save()
        return user
    }
}