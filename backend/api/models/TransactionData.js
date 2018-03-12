"use strict";
let Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	let transaction_data = sequelize.define("transaction_data", {
		id:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
		hash_id: Sequelize.STRING,
    verified: Sequelize.BOOLEAN,
    title: Sequelize.STRING,
    author: Sequelize.STRING,
    description: Sequelize.STRING,
    upvoters: Sequelize.INTEGER,
    downvoters: Sequelize.INTEGER,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    url: Sequelize.STRING
	}, {
		classMethods: {
			associate: function(/*models*/) {
				// associations can be defined here
			}
		}
	});
	return transaction_data;
};
