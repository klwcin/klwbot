// Requires and libs set
const Telegram = require('telegram-node-bot')
const BaseScopeExtension = Telegram.BaseScopeExtension
const ReplyKeyboardMarkup = Telegram.Models.ReplyKeyboardMarkup
const KeyboardButton = Telegram.Models.KeyboardButton

module.exports = class CorrectMenuScopeExtension extends BaseScopeExtension {
    /**
     * Corrects the 'runMenu' in Scope to get Location
     * @param {Object} menuData
     */
    process(menuData) {
        const startMessage = menuData.message
        const ignoredKeys = [
            'message',
            'layout',
            'options',
            'resizeKeyboard',
            'oneTimeKeyboard',
            'anyMatch',
            'request_location'
        ]

        const request_location =
            (menuData.request_location && menuData.request_location === true)

        const keys = Object.keys(menuData)
        let keyboard = []

        if (menuData.layout) {
            let lineIndex = 0

            keys.forEach(key => {
                if (ignoredKeys.indexOf(key) === -1) {
                    if (!keyboard[lineIndex])
                        keyboard[lineIndex] = []

                    keyboard[lineIndex].push(
                        new KeyboardButton(key, null, request_location ? request_location : null)
                    )

                    if (typeof menuData.layout === 'number') {
                        if (keyboard[lineIndex].length === menuData.layout) {
                            lineIndex++
                        }
                    } else {
                        if (keyboard[lineIndex].length === menuData.layout[lineIndex]) {
                            lineIndex++
                        }
                    }
                }
            })
        } else {
            keys.forEach(key => {
                if (ignoredKeys.indexOf(key) === -1) {
                    keyboard.push(
                        [new KeyboardButton(key, null, request_location ? request_location : null)]
                    )
                }
            })
        }

        const resizeKeyboard = (menuData.resizeKeyboard && menuData.resizeKeyboard === true)
        const oneTimeKeyboard = (menuData.oneTimeKeyboard && menuData.oneTimeKeyboard === true)

        let replyMarkup = new ReplyKeyboardMarkup(keyboard, resizeKeyboard, oneTimeKeyboard)

        let options = {
            reply_markup: JSON.stringify(replyMarkup)
        }

        if (menuData.options) options = Object.assign(options, menuData.options)

        this.sendMessage(startMessage, options)

        this.waitForRequest
            .then($ => {
                if (keys.indexOf($.message.text) > -1 &&
                    ignoredKeys.indexOf($.message.text) === -1) {
                    if (typeof menuData[$.message.text] === 'object') {
                        $.runMenuOk(menuData[$.message.text])
                    } else {
                        menuData[$.message.text]($)
                    }
                } else if (menuData.anyMatch) {
                    menuData.anyMatch($)
                } else {
                    $.runMenuOk(menuData)
                }
            })
    }

    get name() {
        return 'runMenuOk'
    }
}