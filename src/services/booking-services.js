const axios = require('axios')
const {BookingRepository} = require('../repositories')
const AppError = require('../utils/errors/app-error')
const db = require('../models')
const { StatusCodes } = require('http-status-codes')
const {ServerConfig} = require('../config')

const BookingInstance = new BookingRepository()


async function createBooking(data){
    const transaction = await db.sequelize.transaction()
    try {
        console.log(data)
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


module.exports = {
    createBooking
}
