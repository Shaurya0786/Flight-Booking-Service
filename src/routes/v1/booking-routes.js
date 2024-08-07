const {bookingController} = require('../../controllers')
const express = require('express')

const router = express.Router()


router.post('/',bookingController.createBookingController)

router.post('/payment',bookingController.makePaymentController)

router.get('/users/:id',bookingController.userBookings)

router.post('/:id/cancel',bookingController.cancelBookingController)

module.exports = router                                                