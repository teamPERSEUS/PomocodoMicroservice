if (process.env.NODE_ENV !== 'production')
require('dotenv').config();
const Sequelize = require('sequelize');
// var db = new Sequelize('vsCode', 'root', '', {
// 	host: 'localhost',
// 	dialect: 'mysql'
// });
var db = new Sequelize(process.env.DATABASE_URL);

db.authenticate()
	.then(() => {
		console.log('DB connected!');
	})
	.catch(err => {
		console.log('DB connect Failed', err);
	});

const Intervals = db.define('interval', {
	git_id: {
		type: Sequelize.STRING
	},
	date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
	user: Sequelize.STRING,
	repoUrl: Sequelize.STRING,
	issue: Sequelize.STRING,
	fileName: Sequelize.STRING,
	intervalNum: Sequelize.INTEGER,
	state: Sequelize.STRING,
	time: Sequelize.INTEGER,
	wordCount: Sequelize.INTEGER,
	idleTime: Sequelize.INTEGER
});

db.sync();

module.exports = {
	db,
	Intervals
};
