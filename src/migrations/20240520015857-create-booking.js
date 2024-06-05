'use strict';
/** @type {import('sequelize-cli').Migration} */
const {BookingEnums} = require('./../utils/common/enum-string')
const {BOOKED,PENDING,INITIATED,CANCELLED} = BookingEnums
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      status: {
        type: Sequelize.ENUM,
        values:[BOOKED,PENDING,INITIATED,CANCELLED],
        allowNull:false
      },
      noofSeats: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      totalPrice: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};