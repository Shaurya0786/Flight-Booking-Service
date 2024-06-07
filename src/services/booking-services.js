const axios = require('axios')
const {BookingRepository} = require('../repositories')
const AppError = require('../utils/errors/app-error')
const db = require('../models')
const { StatusCodes } = require('http-status-codes')
const {ServerConfig} = require('../config')
const {BookingEnums} = require('../utils/common/enum-string');
const { BOOKED, CANCELLED } = BookingEnums;

const BookingInstance = new BookingRepository()


async function createBooking(data){
    const transaction = await db.sequelize.transaction()
    try {
        const flight = await axios.get(`${ServerConfig.Flighturl}/${data.flightId}`)
        const flightdata = flight.data.data
        if(data.noofSeats>flightdata.totalSeats) throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
        const totalBilling = data.noofSeats * flightdata.price
        const bookingPayload = {...data,totalPrice:totalBilling}
        const booking = await BookingInstance.create(bookingPayload, transaction)
        await axios.patch(`${ServerConfig.Flighturl}/${data.flightId}`,{seats:data.noofSeats})
        await transaction.commit()
        return booking
    } catch (error) {
        await transaction.rollback()
        return error
    }
}

async function makePayment(data){
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await BookingInstance.getBooking(data.bookingId,transaction)
        if(bookingDetails.status == CANCELLED) throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST)
        const bookingTime = new Date(bookingDetails.createdAt)
        const currentTime = new Date();
        if(currentTime-bookingTime>300000){
                await cancelBooking({
                    flightId:bookingDetails.flightId,
                    bookingId:data.bookingId,
                    userId:data.userId,
                })
                throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);   
        }
        if(bookingDetails.totalPrice!=data.totalCost){
            throw new AppError('The amount of the payment doesnt match', StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.userId != data.userId) {
            throw new AppError('The user corresponding to the booking doesnt match', StatusCodes.BAD_REQUEST);
        }

        // here the payment method is successfull
        await BookingInstance.updateBooking(data.bookingId, {status: BOOKED}, transaction);
        await transaction.commit();

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}


async function userBookingService(data){
    try {
        const userbookings = await BookingInstance.userBooking(data)
        return userbookings
    } catch (error) {
        throw error
    }
}

async function cancelBooking(data){
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await BookingInstance.getBooking(data.bookingId,transaction)
        if(bookingDetails.status == CANCELLED) {
            await transaction.commit();
            return true;
        }
        if(bookingDetails.userId != data.userId) {
            throw new AppError('The user corresponding to the booking doesnt match', StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.flightId != data.flightId) {
            throw new AppError('The flightId doesnt match to the booking doesnt match', StatusCodes.BAD_REQUEST);
        }
        await axios.patch(`${ServerConfig.Flighturl}/${bookingDetails.flightId}/seats`,{seats:bookingDetails.noofSeats,decrease:0})
        await BookingInstance.update(data.bookingId, {status: CANCELLED}, transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    createBooking,
    makePayment,
    userBookingService,
    cancelBooking
}
