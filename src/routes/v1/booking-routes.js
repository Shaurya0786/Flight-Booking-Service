const {bookingController} = require('../../controllers')
const express = require('express')

const router = express.Router()


router.post('/',bookingController.createBookingController)

router.post('/payment',bookingController.makePaymentController)

router.get('/users/:id',bookingController.userBookings)

module.exports = router                                                