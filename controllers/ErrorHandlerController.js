// Requires and libs set
const KlwBaseController = require('./KlwBaseController')

/**
 * Used to handle errors
 */
module.exports = class ErrorHandlerController extends KlwBaseController {
    /**
     * All that is not defined goes to the log
     * @param {Scope} $
     */
    handle($) {
        // All the not implemented is considered an error
        console.log($)
    }
}