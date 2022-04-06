"use strict";

/** Convenience middleware to handle common functions. */

// Format input string to phone number XXX-XXX-XXXX. 
// Return null if cannot format it
function formatPhoneNumber(num) {

    //remove "+", ".", " ", "-" from string
    let phoneNumFormatted = num.replaceAll("+","").replaceAll(".","").replaceAll(/\s/g,"").replaceAll("-","");
    
    //remove heading 0 from string
    try{
      phoneNumFormatted = parseInt(phoneNumFormatted).toString();
    }
    catch (e) {
      return null;
    }

    //Remove country code "1" from first character
    if (phoneNumFormatted.length == 11 && phoneNumFormatted[0]=="1")
    {
      phoneNumFormatted = phoneNumFormatted.substring(1,11);
    }

    //Add "-" to the phone number
    if (phoneNumFormatted.length == 10)
    {
      phoneNumFormatted = phoneNumFormatted.substring(0,3) + "-" + phoneNumFormatted.substring(3,6) + "-" + phoneNumFormatted.substring(6,10)
    }
    else{
      return null;
    }

    return phoneNumFormatted;
}

//If input string is an URL then return it. Otherwise, return null
function formatURL(url) {

    //Invalid URL
    if(url.indexOf(",") >= 0)
    {
        return null;
    }

    if(url.indexOf("www.")==0)
    {
        url="http://" + url;
    }

    if(url.indexOf("http://")==0 || url.indexOf("https://")==0 )
    {
        return url;
    }
    else{
        return null;
    }
    
}
  
  module.exports = { formatPhoneNumber, formatURL };