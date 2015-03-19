var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render(
    'index',
    {
        title: 'Mathdash',
        slick: {
            'slidesToShow': 3,
            // 'slidesToScroll': 2, // this is instead of 'swipeToSlide'
            'swipeToSlide': true,
            'arrows': true,
            'mobileFirst': true
        },
        cache: false
    });
});

module.exports = router;
