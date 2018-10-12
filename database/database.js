const Sequelize = require('sequelize');
var db = new Sequelize('vsCode', 'root', '', {
	host: 'localhost',
	dialect: 'mysql'
});

db.authenticate()
	.then(() => {
		console.log('DB connected!');
	})
	.catch(err => {
		console.log('DB connect Failed', err);
	});

const Intervals = db.define('interval', {
	date: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	},
	user: Sequelize.STRING,
	repo: Sequelize.STRING,
	issue: Sequelize.STRING,
	fileName: Sequelize.STRING,
	interval: Sequelize.INTEGER,
	state: Sequelize.STRING,
	time: Sequelize.INTEGER,
	wordCount: Sequelize.INTEGER
});

db.sync();

module.exports = {
	db,
	Intervals
};
