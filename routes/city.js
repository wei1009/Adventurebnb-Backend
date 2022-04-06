"use strict";

/** Routes for jobs. */
const express = require("express");
const { BadRequestError } = require("../expressError");
const Hotel = require("../models/Hotel");
const router = express.Router({ mergeParams: true });
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const request = require("request");
const { createHotelApiKey } = require("../helpers/hotelApi");
const { formatPhoneNumber, formatURL } = require("../middleware/commonFunc");

/** GET / hotel data by city and zip code
 *
 * Returns hotel json
 **/
router.get("/", async function (req, res, next) {
  const q = req.query;
  let page;
  let type;
  let returnObj = {};

  if (req.query.page == "null" || req.query.page == undefined) {
    page = 1
  }
  else {
    page = req.query.page
  }

  try {

    type = req.query.type;
    if (type !== "city" && type !== "zip") {
      throw new BadRequestError('Insufficient Query String "Type"');
    }
  } catch (err) {
    return res.status(err.status).send(err.message);
  }
  try {
    let dbHotels;

    if (type == "city") {
      dbHotels = await Hotel.findHotelsByCity(q);
    } else {
      dbHotels = await Hotel.findHotelsByZip(q);
    }

    let dataFrom = (page - 1) * 50;
    let dataTo = page * 50 - 1;
    let hotelCode = "";

    returnObj.totalCount = dbHotels.length;

    for (let i = dataFrom; i < dbHotels.length; i++) {
      hotelCode += dbHotels[i].code + ",";

      if (i >= dataTo) {
        break;
      }
    }
    let hash = createHotelApiKey();

    request(`https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels/${hotelCode}/details?language=ENG&useSecondaryLanguage=False`,
      {
        qs: {
          // fields: "code,name,stateCode,address,city,postalCode",
          language: "ENG",
          // countryCode: "US",
          useSecondaryLanguage: "false",
          fields: "code,name,categoryGroup,address,city,state,postalCode,web,phones,image,S2C,ranking"
        },
        headers: {
          "Api-key": API_KEY,
          "secret": API_SECRET,
          "X-Signature": hash,
          "Accept": 'application/json'
        }
      },
      function (error, response, body) {
        let data = JSON.parse(body);

        if (response.statusCode !== 200) {
          return res.status(response.statusCode).send(data.error);
        }

        let hotelArray = [];

        if (Array.isArray(data.hotels)) {
          hotelArray = data.hotels
        }
        else {
          hotelArray.push(data.hotel);
        }
        //Choose mainInage
        hotelArray.forEach(h => {
          //Handle Images
          if (h.images !== undefined && h.images !== null && h.images.length > 0) {
            let imageList = h.images;
            let image = null;

            let image_code = {
              "GEN": 1,          //General
              "COM": 2,          //Lobby
              "DEP": 3,          //Sports and Entertainment
              "RES": 4,          //Restaurant
              "CON": 5,          //Conference
              "PIS": 6,           //Pool
              "PLA": 7,          //Beach
              "BAR": 8,          //Bar
              "TER": 9,          //Terrace
              "HAB": 10          //Room
            }

            imageList.sort(function (a, b) {
              if (image_code[a.imageTypeCode] == image_code[b.imageTypeCode]) {
                return a.visualOrder - b.visualOrder;
              } else {
                return image_code[a.imageTypeCode] - image_code[b.imageTypeCode]
              }
            });
            image = "http://photos.hotelbeds.com/giata/original/" + imageList[0].path
            h.mainImage = image
          }

          //Handle phone #
          if (h.phones !== undefined && h.phones !== null && h.phones.length > 0) {
            h.mainPhone = h.phones[0].phoneNumber;
            h.mainPhoneFormatted = formatPhoneNumber(h.mainPhone)
          }

          //Format wel
          if (h.web !== undefined && h.web !== null){
            h.webFormatted = formatURL(h.web);
          }
        })

        returnObj.hotelData = hotelArray;
        return res.send(returnObj);
      })
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
