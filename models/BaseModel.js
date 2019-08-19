/**
 * Base model for all classes
 */
module.exports = class BaseModel {
    /**
     * Create class from data
     * @param {Object} data: Data to fill new object
     * @param {Boolean} flag: Used to indicate if fill or not the object
     */
    constructor(data, flag) {
        // flag === undefined means true
        if ((flag === undefined) || flag) {
            // no data, no fill
            if (data) {
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
        }
    }

    /**
     * Stringfy this object using JSON
     */
    toString() {
        return JSON.stringify(this, null, 2)
    }
}