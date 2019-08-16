module.exports = class Message {
    constructor(data) {
        Object.keys(data).forEach((e) => {
            this[e.replace('_', '')] = data[e]
        })
    }
}