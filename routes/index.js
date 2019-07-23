const express = require('express')
const router = express.Router();

const UrlModel = require('../models/url');

// This finds shortened url in DB and redirects to longUrl
// @route     GET /:code
router.get('/:code', async (req, res) => {
  try {
    const url = await UrlModel.findOne({ urlCode: req.params.code });
    

    if (url) {
      console.log('url', url.longUrl)
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json('No url found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});


module.exports = router