const CrudRepository = require('./crud-repository')
const {Booking} = require('../models/index');
const { AppError } = require('../utils');
const { StatusCodes } = require('http-status-codes');

class BookingRepository extends CrudRepository {
    constructor(){
        super(Booking)
    }

    async createBooking(data, transaction) {
        const response = await Booking.create(data, {transaction: transaction});
        return response;
    }

    async getBooking(data,transaction){
        const response = await this.model.findByPk(data,{transaction: transaction})
        if(!response) throw new AppError('No Booking Found',StatusCodes.NOT_FOUND)
        return response
    }


    async updateBooking(id,data,transaction){
        const response = await this.model.update(data, {
            where: {
                id: id
            }
        }, {transaction: transaction});
        return response;
    }
    
    async userBooking(id){
        const response = await this.model.findAll({
            where:{
                userId:id
            }
        })
        if(!response) throw new AppError('No Booking Found',StatusCodes.NOT_FOUND)
        return response
    }
}


module.exports = BookingRepository