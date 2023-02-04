const router = require('express').Router();
const axios = require('axios');
const qs = require('qs');
const Users = require('../models/Users');
require('dotenv').config()

router.get('/', (req,res) => {
    const user = req.session.user
    console.log(user);
    res.render('courses', {user: req.session.user})
})

router.get('/:id', (req,res) => {
    if (req.params.id === "budgeting") {
        res.render('budgeting', {user: req.session.user})
    } else {
        res.redirect('/courses')
    }
})

router.post('/coin', async (req, res) => {
    console.log(req.body);
    const id = req.body.id
    const user = await getUser(id)
    user.coins = 1000
    user.save()
    res.json({ success: true });
})

const getUser = (id) => {
    return new Promise((resolve, reject) => {
      Users.findById(id, (err, user) => {
        if (err) { 
          reject(err) 
        } else {
          resolve(user)
        }
      })
    })
  }  

module.exports = router;