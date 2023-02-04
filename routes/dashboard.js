const router = require('express').Router();
const axios = require('axios');
const qs = require('qs');
const Users = require('../models/Users');
require('dotenv').config()

router.get('/', (req,res) => {
    const user = req.session.user
    console.log(user);
    res.render('dashboard', {user: req.session.user})
})

module.exports = router;