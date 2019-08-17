/**
 * Class used to do important calculations
 */
module.exports = class Calculations {
    /**
     * Calculate distance between lat/lon pairs
     * @param {Number} lat1 
     * @param {Number} lon1 
     * @param {Number} lat2 
     * @param {Number} lon2 
     */
    distance(lat1, lon1, lat2, lon2) {
        let R = 6371 // Radius of the earth in km
        let dLat = (lat2 - lat1) * Math.PI / 180  // Javascript functions in radians
        let dLon = (lon2 - lon1) * Math.PI / 180 
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        let d = R * c // Distance in km
        return d.toFixed(2)
    }
}