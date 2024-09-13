const asyncHandler = require('express-async-handler')
// const User = require('../models/User')
// const Booking = require('../models/Booking')

const train_begin = asyncHandler(async (req, res) => {
  console.log("train_begin", req.body)
  res.json({success: true})
})

const epoch_begin = asyncHandler(async (req, res) => {
  console.log("epoch_begin", req.body)
  res.json({success: true})
})

const epoch_end = asyncHandler(async (req, res) => {
  console.log("epoch_end", req.body)
  res.json({success: true})
})

const train_end = asyncHandler(async (req, res) => {
  console.log("train_end", req.body)
  res.json({success: true})
})

module.exports = { train_begin, epoch_begin, epoch_end, train_end}