const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {
        title: 'Login',
        error: !!req.query.error,
        logout: !!req.query.logout
    });
});

module.exports = router;
