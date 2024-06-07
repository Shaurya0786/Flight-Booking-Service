const { StatusCodes } = require('http-status-codes')
const {BookigService} = require('../services')
const {SuccessResponse,ErrorResponse} = require('../utils/common')


async function createBookingController(req,res){
    try {
        const booking = await BookigService.createBooking({
            flightId:req.body.flightId,
            userId:req.body.userId,
            noofSeats:req.body.noofSeats
        })
        SuccessResponse.data = booking
        return res.status(StatusCodes.CREATED).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse)
    }
}


async function makePaymentController(req, res) {
    try {
        const response = await BookigService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.body.userId,
            bookingId: req.body.bookingId
        });
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch(error) {
        ErrorResponse.error = error;
        return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}


async function userBookings(req,res){
    try {
        const response = await BookigService.userBookingService(req.params.id)
        SuccessResponse.data = response
        return res.status(StatusCodes.CREATED).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}

async function cancelBookingController(req,res){
    try {
        const response = await BookigService.cancelBooking({
            flightId:req.body.flightId,
            bookingId:req.params.id,
            userId:req.body.userId,
        })
        SuccessResponse.data = response
        return res.status(StatusCodes.CREATED).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}

module.exports = {
    createBookingController,
    makePaymentController,
    userBookings,
    cancelBookingController
}