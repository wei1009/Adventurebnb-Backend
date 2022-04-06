"use strict";

const db = require("../db");

/** Related functions for companies. */

class Hotel {

  /** Given a city and state, return data about hotel.
   *
   * Returns {code, name}
   *
   * Throws NotFoundError if not found.
   **/
  static async findHotelsByCity(searchFilters = {}) {
    const { cityCode, stateCode } = searchFilters;
    let query = `SELECT code, name FROM hotel WHERE city ='${cityCode}' and STATE = '${stateCode }' order by id`;
    
    const hotelsRes = await db.query(query);
    return hotelsRes.rows;
  }

  /** Given a zip, return data about hotel.
   *
   * Returns {code, name}
   *
   * Throws NotFoundError if not found.
   **/
  static async findHotelsByZip(searchFilters = {}) {
    const { zipCode} = searchFilters;
    let query = `SELECT code, name FROM hotel WHERE zip ='${zipCode}'  order by id`;
    
    const hotelsRes = await db.query(query);
    return hotelsRes.rows;
  }
}

module.exports = Hotel;
