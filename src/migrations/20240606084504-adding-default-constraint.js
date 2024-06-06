'use strict';

const {BookingEnums} = require('./../utils/common/enum-string')
const {BOOKED,PENDING,INITIATED,CANCELLED} = BookingEnums
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Bookings','status',{
      type: Sequelize.ENUM,
      values:[BOOKED,PENDING,INITIATED,CANCELLED],
      allowNull:false,
      defaultValue:INITIATED
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Bookings','status',{
      type: Sequelize.ENUM,
      values:[BOOKED,PENDING,INITIATED,CANCELLED],
      allowNull:false,
      defaultValue:null
    })
  }
};
