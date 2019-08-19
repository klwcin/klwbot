// Requires and libs set
const BaseModel = require('./BaseModel')

// The class to export
module.exports = class MediaData extends BaseModel {
    /**
     * Create class from data
     * @param {Object} mediaData: data to fill the object with
     */
    constructor(mediaData) {
        // construct but not fill with data
        super(mediaData, false)

        if (mediaData) {
            this.audio = mediaData.audio
            this.document = mediaData.document
            this.photo = mediaData.photo
            this.game = mediaData.game
            this.sticker = mediaData.sticker
            this.video = mediaData.video
            this.voice = mediaData.voice
            this.contact = mediaData.contact
        }
    }
}