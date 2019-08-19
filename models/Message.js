// Requires and libs set
const BaseModel = require('./BaseModel')
const User = require('./User')
const Chat = require('./Chat')
const MediaData = require('./MediaData')

// The class to export
module.exports = class Message extends BaseModel {
    /**
     * Create class from data
     * @param {Object} messageData: data to fill the object with
     */
    constructor(messageData) {
        // construct but not fill with data
        super(messageData, false)

        if (messageData) {
            this.id = messageData.messageId
            this.user = User.find({
                id: messageData.from.id
            })
            this.date = new Date(messageData.date * 1000)
            this.text = messageData.text
            if (messageData.entities !== null) {
                if (messageData.entities.length > 0) {
                    this.type = messageData.entities[0].type
                }
            }
            this.location = messageData.location
            this.chat = Chat.find({
                id: messageData.chat.id
            })

            if (this.haveMedia(messageData)) {
                this.media = new MediaData({
                    audio: messageData.audio,
                    document: messageData.document,
                    game: messageData.game,
                    photo: messageData.photo,
                    sticker: messageData.sticker,
                    video: messageData.video,
                    voice: messageData.voice,
                    contact: messageData.contact
                }).save()
            }
        }
    }

    /**
     * Verifies if message have media data
     * @param {Object} messageData: data to verify
     */
    haveMedia(messageData) {
        return (
            messageData.audio || messageData.document ||
            messageData.game || messageData.photo ||
            messageData.sticker || messageData.video ||
            messageData.voice || messageData.contact
        )
    }
}