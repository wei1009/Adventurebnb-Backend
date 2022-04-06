"use strict";

/** Routes for hotels. */

const express = require("express");
const Hotel = require("../models/Hotel");
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const request = require("request");
const crypto = require('crypto');
const router = new express.Router();
const GOOGLE_MAP_API_URL ="https://www.google.com/maps/embed/v1/place";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

/** GET / hotel data
 *
 */

router.get("/", async function (req, res, next) {
  try {
    let hotelCode = req.query.hotelCode
    let adult;
    let children;
    let erroInfo;

    try {
      adult = parseInt(req.query.adult)
    }
    catch (err) {
      erroInfo.message("Input adult is not an valid number.")
      return next(err);
    }

    try {
      children = parseInt(req.query.children)
    }
    catch (err) {
      erroInfo.message("Input children is not an valid number.")
      return next(err);
    }

    let test = Math.floor(Date.now() / 1000);

    const hash = crypto.createHash('sha256')
      .update(API_KEY + API_SECRET + test) // <-- this is the needed message to encrypt
      .digest("hex");


    request(`https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels/${hotelCode}/details?language=ENG&useSecondaryLanguage=False`,
      {
        qs: {
          language: "ENG",
          useSecondaryLanguage: "false"
        },
        headers: {
          "Api-key": API_KEY,
          "secret": API_SECRET,
          "X-Signature": hash,
          "Accept": 'application/json'
        }
      },

      function (error, response, body) {
        if (!error && response.statusCode == 200) {

          let h = JSON.parse(body);
          let hotel = h.hotel;
          let imageList = hotel.images;
          let roomList = hotel.rooms;
          let facilityList = hotel.facilities;
          let image = null;
          let imagedetail = {};
          let img = [];
          let rooms = [];
          let facilities = [];

          if (imageList !== undefined && imageList !== null && imageList.length > 0) {
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
            imagedetail = imageList.map(i => (
              {
                "type": i.type.code,
                "path": i.path,
                "order": i.order,
                "visualOrder": i.visualOrder
              }
            ))

            for (let i = 0; i < imagedetail.length; i++) {
              if (imagedetail[i].type === "HAB") {
                img.push(imagedetail[i])
              }
            }
          };

          //Filter room by adult & childrem
          let filteredRoom = roomList.filter(r => {
            return r.maxAdults >= adult && r.maxPax >= adult + children;
          });

          if (filteredRoom !== undefined && filteredRoom !== null && filteredRoom.length > 0) {
            rooms = filteredRoom.map((el) => {

              let roomDetail = {};
              let roomImages = [];

              //Get room image from API image list (Match by room code)
              if (imageList !== undefined && imageList !== null) {
                roomImages = imageList.filter(obj => {
                  return obj.type.code === "HAB" && obj.roomCode == el.roomCode;
                });

                if (roomImages !== undefined && roomImages !== null && roomImages.length > 0) {
                  roomImages.sort(function (a, b) {
                    return a.visualOrder - b.visualOrder;
                  });
                  roomImages.forEach((e) => {
                    e.path = "http://photos.hotelbeds.com/giata/original/" + e.path;
                  });

                }
              }

              if (roomImages.length == 0) {
                roomImages=null;
                let defaultImage = {};
                // let imageType = {};

                // imageType.code = "DEFAULT";

                // defaultImage.type = imageType;
                // defaultImage.order = 1;
                // defaultImage.path = "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"

                // roomImages.push(defaultImage);
              }

              roomDetail.roomCode = el.roomCode;
              roomDetail.type = el.type.code;
              roomDetail.maxGuest = el.maxPax;
              roomDetail.maxAdult = el.maxAdults;
              roomDetail.description = el.description;
              roomDetail.roomImages = roomImages;
              return roomDetail;

            });
          }

          if (facilityList !== undefined && facilityList !== null && facilityList.length > 0) {
            for (let i = 0; i < facilityList.length; i++) {
              if (facilityList[i].facilityGroupCode === 73) {
                facilities.push(facilityList[i].description.content)
              }
            }
          }

          let newHotelData = {
            "code": hotel.code,
            "name": hotel.name.content,
            "description": hotel.categoryGroup.description.content,
            "address": hotel.address.content + ", " + hotel.city.content + ", " + hotel.state.code + " " + hotel.postalCode,
            "coordinates": {
              "lng": hotel.coordinates.longitude,
              "lat": hotel.coordinates.latitude
            },
            "issue": hotel.issues[0].description.content,
            "image": image,
            "facilities": facilities,
            "room": rooms,
            "web": hotel.web,
            "starRating": hotel.S2C,
            "ranking": hotel.ranking
          }

          return res.send(newHotelData);
        }
        else {
          console.log("API Error: " + response.statusCode)
        }
      })
  } catch (err) {
    return next(err);
  }
});


/** GET / google api link
 *
 */
router.get("/google", async function (req, res, next) {

  try {
    let lat = req.query.lat;
    let lng = req.query.lng;
    let mapInfo = (`${GOOGLE_MAP_API_URL}?key=${GOOGLE_API_KEY}&q=${lat},${lng}&zoom=13`)
    return res.send(mapInfo)
  } catch (err) {
    return next(err);
  }
})

module.exports = router;
