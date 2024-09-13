const express = require('express')
const { train_begin, epoch_begin, epoch_end, train_end } = require('../controller/training')

const trainingRoutes = express.Router()

trainingRoutes.route('/train_begin').post(train_begin)
trainingRoutes.route('/epoch_begin').post(epoch_begin)
trainingRoutes.route('/epoch_end').post(epoch_end)
trainingRoutes.route('/train_end').post(train_end)


module.exports = trainingRoutes;

