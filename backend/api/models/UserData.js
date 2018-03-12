"use strict";
let Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	let user_data = sequelize.define("user_data", {
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
	}, {
		classMethods: {
			associate: function(/*models*/) {
				// associations can be defined here
			}
		}
	});
	return user_data;
};
