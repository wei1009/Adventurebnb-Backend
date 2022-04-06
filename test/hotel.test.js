"use strict";

const db = require("../db.js");
const Hotel = require("../models/Hotel.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUsersIds,
  testUserPlanIds
} = require("../models/_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("search hotel", function () {
  const newHotel = [{
    code: 72285,
    name: "HYATT PLACE LAS VEGAS"
  }];

  const searchFilter = {
    cityCode: "LAS VEGAS",
    stateCode: "NV"
  }

  test("find hotels by city", async function () {
    let hotel = await Hotel.findHotelsByCity(searchFilter);
    expect(hotel).toEqual(newHotel);

    const result = await db.query(
      `SELECT *
           FROM hotel
           WHERE code = 72285`);
    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        code: 72285,
        name: "HYATT PLACE LAS VEGAS",
        street1: "4520 PARADISE RD",
        city: "LAS VEGAS",
        state: "NV",
        zip: "89169",
        image: "https://photos.hotelbeds.com/giata/07/072285/072285a_hb_a_001.jpg"
      },
    ]);
  });
});