const axios = require('axios')
const {BookingRepository} = require('../repositories')
const AppError = require('../utils/errors/app-error')
const db = require('../models')
const { StatusCodes } = require('http-status-codes')
const {ServerConfig} = require('../config')

const BookingInstance = new BookingRepository()


async function createBooking(data){
        return new Promise((resolve,reject)=>{
                db.sequelize.transaction(async function bookingImp(t){
                const flight = await axios.get(`${ServerConfig.Flighturl}/${data.flightId}`)
                const flightdata = flight.data.data
                if(data.noOfSeats>flightdata.totalSeats) reject( new AppError('No of Seats Not Avaliable',StatusCodes.INTERNAL_SERVER_ERROR))
                resolve(flightdata)
        })
    })
}


module.exports = {
    createBooking
}
