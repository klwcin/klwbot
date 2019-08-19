// Requires and libs set
const BaseModel = require('./BaseModel')

// The class to export
module.exports = class User extends BaseModel {
    /**
     * Create class from data
     * @param {Object} userData: data to fill the object with
     */
    constructor(userData) {
        // construct but not fill with data
        super(userData, false)

        if (userData) {
            this.id = userData.id
            this.firstName = userData.firstName
            this.lastName = userData.lastName
            this.username = userData.username
        }
    }
}