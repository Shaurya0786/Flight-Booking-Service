const {bookingController} = require('../../controllers')
const express = require('express')

const router = express.Router()


router.post('/',bookingController.createBookingController)


module.exports = router