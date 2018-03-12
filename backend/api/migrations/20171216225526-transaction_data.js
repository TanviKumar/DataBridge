'use strict';
let Sequelize = require("sequelize");
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('transaction_data', {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      hash_id: Sequelize.STRING,
      author: Sequelize.STRING,
      verified: Sequelize.BOOLEAN,
      title: Sequelize.STRING,
      description: Sequelize.STRING,
      upvoters: Sequelize.TEXT,
      downvoters: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      url: Sequelize.STRING
    })
    .catch(err => {
      console.log(err);
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
