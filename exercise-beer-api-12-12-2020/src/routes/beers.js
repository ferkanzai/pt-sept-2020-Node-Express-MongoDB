const { ifError } = require("assert");
const express = require("express");
const fs = require("fs");
const router = express.Router();
const { BEERS_DB } = require("../constants");

const getBeersList = (beers_db) => JSON.parse(fs.readFileSync(beers_db))

router.get("/", async (req, res) => {
  let value = "";
  let msg = "";
  try {
    const beersJson = await getBeersList(BEERS_DB)
    let beers = beersJson.slice(0, 25);

    const queryParams = req.query;
    const queryKeys = Object.keys(queryParams);

    if (queryParams) {
      for (key of queryKeys) {
        value = queryParams[key];
        if (!value) {
          msg = "Value is empty";
          throw new Error('empty_value');
        }
        if (key === "per_page") {
          // console.log(value)
          if (value < 81 && value > 0) {
            // console.log(true)
            beers = beersJson.slice(0, value);
          } else {
            msg = "Must be a number between 0 and 80";
            throw new Error('bad_value');
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: beers,
    });
  } catch (error) {
    // console.log(error.message)
    if (msg) {
      res.status(400).json({
        success: false,
        message: "Invalid query params",
        info: [
          {
            location: "query",
            param: `${key}`,
            msg,
            value,
          },
        ],
      });
    }

    console.error("> error:", error.message);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
});

router.get("/random", async (req, res) => {
  try {
    const beersJson = await getBeersList(BEERS_DB)
    const random = ~~(Math.random(beersJson.length) * beersJson.length);

    const singleBeer = beersJson.filter((beer) => beer.id === random);

    res.status(200).json({
      success: true,
      data: singleBeer,
    });
  } catch (error) {
    console.error("> error:", error.message);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const beersJson = await getBeersList(BEERS_DB)
    const id = Number(req.params.id);
    let singleBeer = [];
    try {
      singleBeer = beersJson.filter((beer) => beer.id === id);
      if (singleBeer.length === 0) {
        throw error;
      }
    } catch (error) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: `No beer found with ID ${id}`,
      });
    }
    // console.log(singleBeer)

    res.status(200).json({
      success: true,
      data: singleBeer,
    });
  } catch {
    console.error("> error:", error.message);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
});

module.exports = router;
