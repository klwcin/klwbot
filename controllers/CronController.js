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
                '@' + $.message.from.username +
                ', já estou ligado, mas valeu por lembrar.'
            )
        } else {    // No task yet
            // Confirmation message
            $.sendMessage(
                'Ok @' + $.message.from.username +
                '. Vou tentar lembrar a galera quando chegar a hora.'
            )

            // Schedule
            task = cron.schedule('0 10,15 * * *', () => {
                $.sendMessage('Galera, hora do café, quem vai? Alguém já foi?')
                // Wait for response
                $.waitForRequest.then($ => {
                    // Bot is late :(
                    if ($.message.text.toLowerCase().includes('já')) {
                        $.sendMessage('Pô, nem me chamaram...')
                    // Let's go! :D
                    } else if ($.message.text.toLowerCase().includes('eu') ||
                                $.message.text.toLowerCase().includes('bora')) {
                        $.sendMessage(`Bora @${$.message.from.username}!`)
                    // Forever alone Bot :'(
                    } else {
                        $.sendMessage('Ou eu entendi errado ou me ignoraram...')
                    }
                })
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