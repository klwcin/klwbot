// Requires and libs set
const cron = require('node-cron')
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController

/**
 * Controls the cron cicle of the bot
 */
module.exports = class CronController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    cronHandler($) {
        // Confirmation message
        $.sendMessage(
            'Ok @' + $._message._from._username +
            '. Vou tentar lembrar a galera quando chegar a hora.'
        )

        // Schedule
        cron.schedule('0 10,15 * * *', () => {
            $.sendMessage('Galera, hora do café? Quem vai?')
        })
    }

    get routes() {
        return {
            'cronCommand': 'cronHandler'
        }
    }
}