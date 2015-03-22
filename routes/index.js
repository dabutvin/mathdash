var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render(
    'index',
    {
        title: 'Mathdash',
        slick: {
            centerMode: true,
            centerPadding: '60px',
            slidesToShow: 3,
            responsive: [
            {
              breakpoint: 768,
              settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 3
              }
            },
            {
              breakpoint: 480,
              settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '60px',
                slidesToShow: 1
              }
            }]
        },
        cache: false
    });
});


router.get('/legal', function(req, res) {
	res.render(
		'legal',
		{
			title: 'Legal',
            cache: false
		});
});

router.get('/privacy', function(req, res) {
	res.render(
		'privacy',
		{
			title: 'Privacy Policy',
            cache: false
		});
});

module.exports = router;
