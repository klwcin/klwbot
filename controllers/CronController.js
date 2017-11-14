// Requires and libs set
const cron = require('node-cron')
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController

// Variables
task = false     // The cron task used to remind users

/**
 * Controls the cron cicle of the bot
 */
module.exports = class CronController extends TelegramBaseController {
    /**
     * Handler for cron task (/remind mapped route)
     * @param {Scope} $
     */
    cronHandler($) {
        // Cron task already exists
        if (task) {
            // Alert message
            $.sendMessage(
                '@' + $._message._from._username +
                ', já estou ligado, mas valeu por lembrar.'
            )
        } else {    // No task yet
            // Confirmation message
            $.sendMessage(
                'Ok @' + $._message._from._username +
                '. Vou tentar lembrar a galera quando chegar a hora.'
            )

            // Schedule
            task = cron.schedule('0,43 10,15,17 * * *', () => {
                $.sendMessage('Galera, hora do café? Quem vai?')
            })
        }
    }

    /**
     * Return handlers as commands
     */
    get routes() {
        return {
            'cronCommand': 'cronHandler'
        }
    }
}