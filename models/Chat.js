// Requires and libs set
const BaseModel = require('./BaseModel')
const User = require('./User')

// The class to export
module.exports = class Chat extends BaseModel {
    /**
     * Create class from data
     * @param {Object} chatData: data to fill the object with
     */
    constructor(chatData) {
        // construct but not fill with data
        super(chatData, false)

        if (chatData) {
            this.id = chatData.id
            if (chatData.username) {
                let user = User.find({
                    username: chatData.username
                })

                if (!user) {
                    user = new User({
                        username: chatData.username,
                        firstName: chatData.firstName,
                        lastName: chatData.lastName
                    }).save()
                }
                this.user = user
            }
            this.type = chatData.type
            this.title = chatData.title
            this.allAdmins = chatData.allMembersAreAdministrators
        }
    }
}