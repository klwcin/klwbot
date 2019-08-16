// Requires and libs set
const KlwbotBaseController = require('./KlwbotBaseController')

/**
 * Used to handle errors
 */
module.exports = class ErrorHandlerController extends KlwbotBaseController {
    /**
     * All that is not defined goes to the log
     * @param {Scope} $
     */
    handle($) {
        this.saveUserAndMessageHistory($)
        
        // All the not implemented is considered an error
        console.log($)

        // Database dump
        console.log(this.database.export('json', 2))
    }
}