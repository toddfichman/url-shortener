const express = require('express')
const router = express.Router();
const validUrl = require('valid-url')
const shortid = require('shortid')
const config = require('config');

const UrlModel = require('../models/url')

//This is where the urls are shortened
// @route       POST /api/url/shorten
router.post('/shorten', async (req, res) => {
  // sending longUrl w/ request
  const { longUrl } = req.body;
  const baseUrl = config.get('baseUrl');

  // Check base url
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base url');
  }

  // Create short url code
  const urlCode = shortid.generate();

  // Check long url
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await UrlModel.findOne({ longUrl });

      if (url) {
        // if the shortened url exsits in DB, just send it back
        res.json(url);
      } else {
        const shortUrl = baseUrl + '/' + urlCode;

        url = new UrlModel({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date()
        });

        await url.save();

        res.json(url);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  } else {
    res.status(401).json('Invalid long url');
  }
});


module.exports = router