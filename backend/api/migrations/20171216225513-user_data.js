'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('user_data', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      public_hash: Sequelize.STRING,
      username: Sequelize.STRING,
      password: Sequelize.STRING,
      
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
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
