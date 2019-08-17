/**
 * Base model for all classes
 */
module.exports = class BaseModel {
    /**
     * Create class from data
     * @param {Object} data 
     */
    constructor(data) {
        Object.keys(data).forEach((e) => {
            this[e.replace('_', '')] = data[e]
            if (typeof data[e] === 'object') {
                if (data[e] !== null) {
                    this[e.replace('_', '')] = new Object()
                    Object.keys(data[e]).forEach((_e) => {
                        this[e.replace('_', '')][_e.replace('_', '')] = data[e][_e]
                    })
                }
            }
        })
    }

    /**
     * Stringfy this object using JSON
     */
    toString() {
        return JSON.stringify(this, null, 2)
    }
}