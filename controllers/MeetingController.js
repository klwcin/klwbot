// Requires and libs set
const cron = require('node-cron')
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const Caulculations = require('../utils/Calculations')

// Local variables
var calc = new Caulculations()
var sala2 = { lat: -8.055764, lon: -34.951563 }

/**
 * Controls the bot meeting planning
 */
module.exports = class MeetingController extends TelegramBaseController {
    /**
     * Handler used to show meeting place
     * @param {Scope} $
     */
    placeHandler($) {
        $.api.sendLocation($.message.chat.id, sala2.lat, sala2.lon)
    }

    /**
     * Handler used to show here am I
     * @param {Scope} $
     */
    meHandler($) {
        $.runMenuOk({
            message: 'Você vai?',
            layout: 1,
            options: {
                parse_mode: 'Markdown'
            },
            resizeKeyboard: true,
            oneTimeKeyboard: true,
            'Sim': {
                message: 'De onde tu vem?',
                resizeKeyboard: true,
                oneTimeKeyboard: true,
                request_location: true,
                'Daqui': () => {},  // Only to send location
                anyMatch: ($) => {
                    var dist = calc.distance(
                        parseFloat($.message.location.latitude),
                        parseFloat($.message.location.longitude),
                        sala2.lat,
                        sala2.lon
                    )

                    // Message based on location
                    if (dist >= 4) {
                        $.sendMessage(
                            'Tá longe hein... a ' + dist +
                            'km da sala 2. Acho que alguém não vem pro café hoje. 😅'
                        )
                    } else if (dist >= 1.5) {
                        $.sendMessage(
                            'Mesmo você estando a ' + dist +
                            'km da sala 2 talvez dê pra pegar o café ainda. 😉'
                        )
                    }else if (dist >= 0.75) {
                        $.sendMessage(
                            'Tais perto... só ' + dist +
                            'km. Já está indo pro café? '
                        )
                    } else {
                        $.sendMessage(
                            'Ah mizeravi... tá só na espreita pra tomar café né? 😂'
                        )
                    }
                }
            },
            'Não': () => {
                $.sendMessage('Blz.')
            }
        })
    }

    /**
     * Return handlers as commands
     */
    get routes() {
        return {
            'placeCommand': 'placeHandler',
            'meCommand': 'meHandler'
        }
    }
}