const crypto = require('crypto');
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

/* When request hotel api,
* a SHA256 hash in Hex format calculated from your API key 
* and secret plus current timestamps in secondsis needed
*/
function createHotelApiKey() {

    let datetime = Math.floor(Date.now() / 1000);

    let hash = crypto.createHash('sha256')
      .update(API_KEY + API_SECRET + datetime) 
      .digest("hex");
  
    return hash;
  }
  
  module.exports = { createHotelApiKey };

  