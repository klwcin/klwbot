// Requires and libs set
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const User = require('../models/User')
const Chat = require('../models/Chat')
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
        this.user = this.saveUpdate($)
        return $
    }

    /**
     * All Messages goes to the history
     * @param {Scope} $
     */
    saveUpdate($) {
        let user = User.find({
            id: $.message.from.id
        })

        if (!user) {
            user = new User($.message.from).save()
        }

        let chat = Chat.find({
            id: $.message.chat.id
        })

        if (!chat) {
            new Chat($.message.chat).save()
        }

        new Message($.message).save()
        return user
    }
}