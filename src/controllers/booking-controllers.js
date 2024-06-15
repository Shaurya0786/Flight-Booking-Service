const { StatusCodes } = require('http-status-codes')
const {BookigService} = require('../services')
const {SuccessResponse,ErrorResponse} = require('../utils/common')

const isMemdb={}

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
        return res.status(error.StatusCode).json(ErrorResponse)
    }
}


async function makePaymentController(req, res) {
    try {
        const idempotencyKey = req.headers['x-Idempotency-Key']
        if(!idempotencyKey) return res.status(StatusCodes.BAD_REQUEST).json({message: 'idempotency key missing'})
        if(isMemdb[idempotencyKey]) return res.status(StatusCodes.BAD_REQUEST).json({message: 'Cannot retry on a successful payment'})
        const response = await BookigService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.body.userId,
            bookingId: req.body.bookingId
        });
        isMemdb[idempotencyKey] = idempotencyKey
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch(error) {
        ErrorResponse.error = error;
        console.log(ErrorResponse)
        return res
                .status(error.StatusCode)
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
                .status(error.StatusCode)
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
                .status(error.StatusCode)
                .json(ErrorResponse);
    }
}


module.exports = {
    createBookingController,
    makePaymentController,
    userBookings,
    cancelBookingController
}