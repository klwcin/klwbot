// Requires and libs set
const cron = require('node-cron')
const KlwbotBaseController = require('./KlwbotBaseController')

// Variables
var task = false

/**
 * Controls the cron cicle of the bot
 */
module.exports = class CronController extends KlwbotBaseController {
    /**
     * Handler for cron task (/remind mapped route)
     * @param {Scope} $
     */
    cronHandler($) {
        this.saveUserAndMessageHistory($)

        // Params, remind using it
        if ($.message.text.toLowerCase().includes(':')) {
            var parts = $.message.text.split(':')
            var minute = parts[parts.length - 1]
            var hourParts = parts[0].split(' ')
            var hour = hourParts[hourParts.length - 1]

            // Confirmation message
            $.sendMessage(
                'Ok @' + $.message.from.username +
                '. Vou tentar lembrar a galera às ' +
                hour + ':' + minute + 'h.'
            )

            // Schedule
            var reminder = cron.schedule(minute + ' ' + hour + ' * * *', () => {
                $.sendMessage('Galera, hora do café, quem vai? Alguém já foi?')
                // Wait for response
                $.waitForRequest.then($ => {
                    // Bot is late :(
                    if ($.message.text.toLowerCase().includes('já')) {
                        $.sendMessage('Pô, nem me chamaram... 😭')
                    // Let's go! :D
                    } else if ($.message.text.toLowerCase().includes('eu') ||
                                $.message.text.toLowerCase().includes('bora') ||
                                $.message.text.toLowerCase().includes('🙋‍♂️') ||
                                $.message.text.toLowerCase().includes('👍')) {
                        $.sendMessage(`Bora @${$.message.from.username}!`)
                    // Not today...
                    } else if ($.message.text.toLowerCase().includes('não')) {
                        $.sendMessage('Tsc, tsc.. marrapai... tomar café pô. ☕')
                    // Forever alone Bot :'(
                    } else {
                        $.sendMessage('Ou eu entendi errado ou me ignoraram... 😶')
                    }
                    reminder.destroy()
                })
                reminder.stop()
            })
        // No params, default hours
        } else {
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
                task = cron.schedule('0 10,15 * * 1-5', () => {
                    $.sendMessage('Galera, hora do café, quem vai? Alguém já foi?')
                    // Wait for response
                    $.waitForRequest.then($ => {
                        // Bot is late :(
                        if ($.message.text.toLowerCase().includes('já')) {
                            $.sendMessage('Pô, nem me chamaram... 😭')
                        // Let's go! :D
                        } else if ($.message.text.toLowerCase().includes('eu') ||
                                    $.message.text.toLowerCase().includes('bora') ||
                                    $.message.text.toLowerCase().includes('🙋‍♂️') ||
                                    $.message.text.toLowerCase().includes('👍')) {
                            $.sendMessage(`Bora @${$.message.from.username}!`)
                        // Not today...
                        } else if ($.message.text.toLowerCase().includes('não')) {
                            $.sendMessage('Ok. Fazer o quê né?')
                        // Forever alone Bot :'(
                        } else {
                            $.sendMessage('Ou eu entendi errado ou me ignoraram... 😶')
                        }
                    })
                })
            }
        }
    }

    /**
     * Handler for stopping the task for common hours
     * @param {Scope} $
     */
    stopHandler($) {
        this.saveUserAndMessageHistory($)
        $.sendMessage('Ok, não vou lembrar mais ninguém nas horas padrão.')
        if (task) {
            task.destroy()
            task = false
        }
    }

    /**
     * Return handlers as commands
     */
    get routes() {
        return {
            'cronCommand': 'cronHandler',
            'stopCommand': 'stopHandler'
        }
    }
}