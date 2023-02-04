const router = require('express').Router();
const axios = require('axios');
const qs = require('qs');
const Users = require('../models/Users');
require('dotenv').config()

const { NseIndia } = require('stock-nse-india')
const nseIndia = new NseIndia()
const symbols = ['ADANIENT', 'RELIANCE', 'TCS', 'HCLTECH', 'BHARTIARTL', 'SBIN', 'INFY', 'TITAN', 'NESTLEIND', 'MARUTI']

router.get('/', async (req, res) => {
  const id = req.session.user._id
  const user = await getUser(id)
  const promises = symbols.map(symbol => getEquityDetails(symbol))
  const stocks = await Promise.all(promises)
  user.investments.forEach(investment => {
    const stock = stocks.find(stock => stock.symbol === investment.symbol)
    stock.invested = true
    stock.purchasePrice = investment.purchasePrice
    stock.pChange = ((stock.lastPrice - stock.purchasePrice) / stock.purchasePrice) * 100
    stock.pChange = Math.round((stock.pChange + Number.EPSILON) * 100) / 100
  });
  res.json({ success: true, data: stocks });
})

router.get('/buy', async (req, res) => {
  const id = req.session.user._id
  const symbol = req.query.symbol
  const price = req.query.price
  const user = await getUser(id)
  user.investments.push({ symbol, purchasePrice: price })
  user.coins -= price
  user.save()
  res.json({ success: true });
})

router.get('/sell', async (req, res) => {
  const id = req.session.user._id
  const symbol = req.query.symbol
  const purchasePrice = req.query.purchasePrice
  const currentPrice = req.query.currentPrice
  const user = await getUser(id)
  user.investments = user.investments.filter(investment => investment.symbol !== symbol)
  user.coins += (currentPrice - purchasePrice)
  user.save()
  res.json({ success: true });
})

const getEquityDetails = (symbol) => {
  return new Promise((resolve, reject) => {
    nseIndia.getEquityDetails(symbol).then(details => {
      const customStock = {
        symbol: details.info.symbol,
        name: details.info.companyName.replace('Limited', ''),
        lastPrice: details.priceInfo.lastPrice,
        pChange: details.priceInfo.pChange,
        url: `https://google.com/search?q=${details.info.symbol}+stock`,
        invested: false,
        purchasePrice: 0,
      }
      customStock.pChange = Math.round((customStock.pChange + Number.EPSILON) * 100) / 100
      resolve(customStock)
    })
  })
}

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