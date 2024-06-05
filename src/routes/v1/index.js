const express = require('express')

const router = express.Router();
const {infocontroller} = require('../../controllers')
const bookingRoutes = require('./booking-routes')

router.get('/info',infocontroller.info)

router.use('/bookings',bookingRoutes)

module.exports = router;