// Requires and libs set
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController

/**
 * Controls the bot meeting planning
 */
module.exports = class MeetingController extends TelegramBaseController {
    /**
     * Handler used to show meeting place
     * @param {Scope} $
     */
    placeHandler($) {
        $.api.sendLocation($.message.chat.id, -8.055764, -34.951563)
    }

    /**
     * Return handlers as commands
     */
    get routes() {
        return {
            'placeCommand': 'placeHandler'
        }
    }
}