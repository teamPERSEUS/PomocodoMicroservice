if (process.env.NODE_ENV !== 'production')
	require('dotenv').config();
const Axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const { Intervals } = require('../database/database');

const analyticsURL = (process.env.NODE_ENV !== 'production')
	? `http://${process.env.HOST}:${process.env.ANALYTICS}`
	: process.env.ANALYTICS_SERVICE;

const app = express();
app.use(bodyParser.json());

// CORS headers
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', '*');
	next();
});

app.post('/test', (req, res) => {
	console.log(req.body);
	res.send(true);
});

app.get('/', (req, res) => {
	Intervals.findAll().then(intervals => {
		var intervalList = intervals.map(interval => {
			return interval.get('id');
		});
		console.log(intervalList);
		res.send(intervalList);
	});
});

app.post('/interval', (req, res) => {
	// console.log(req.body.data);

	var fields = ['issue', 'fileName', 'state'];
	var dbResultArr = [];
	var intervalData = req.body.data;
	var recurse = function (dbObj, intervalData, index = 0) {
		if (index === fields.length) {
			for (var key in intervalData) {
				dbObj[key] = intervalData[key];
			}
			dbResultArr.push(Object.assign({}, dbObj));
			return;
		}

		var keys = Object.keys(intervalData);
		keys.forEach(function (key) {
			dbObj[fields[index]] = key;
			recurse(dbObj, intervalData[key], index + 1);
		});
	};

	recurse(
		{
			intervalNum: req.body.interval,
			user: req.body.userId,
			repoUrl: req.body.gitRepoUrl,
			git_id: req.body.gitId,
			idleTime: req.body.idleTime
		},
		intervalData,
		0
	);

	console.log(dbResultArr);
	Intervals.bulkCreate(dbResultArr).then(() => {
		console.log('Saved to DB!');
		Axios.post(
			`${analyticsURL}/api/vsCodeMicro`,
			{
				data: dbResultArr
			}
		)
			.then(console.log('sent to Analytics server!'))
			.catch(function (error) {
				console.log(error + 'error sending to Analytics server');
			});
	});
});

app.listen(process.env.PORT, () => {
	console.log(
		`App listening on http://${process.env.HOST}:${process.env.PORT}`
	);
});
