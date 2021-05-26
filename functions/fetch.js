//"use strict";

const got = require("got");


exports.fetchWeight = async (Token, lastUpdate) => {
	console.log("fetchWeight");

	// 体重データの取得
	const response = await got.post("https://wbsapi.withings.net/v2/measure", {
		headers: {
			Authorization: "Bearer " + Token.access_token,
		},
		json: {
			action: "getmeas",
			meastype: 1,
			cateegory: 1,
			lastupdate: lastUpdate.created + 1,
		},
	});

	return response;
};

exports.fetchHR = async (Token, lastUpdate) => {
	console.log("fetchHR");

	// HRデータの取得
	const response = await got.post("https://wbsapi.withings.net/v2/measure", {
		headers: {
			Authorization: "Bearer " + Token.access_token,
		},
		json: {
			action: "getintradayactivity",
			data_fields: "heart_rate",
			startdate: lastUpdate + 1,
		},
	});

	return response;
};

exports.fetchActivity = async (Token, lastUpdate) => {
	console.log("fetchActivity");
	// access_tokenの設定

	// 活動量データの取得
	const response = await got.post("https://wbsapi.withings.net/v2/measure", {
		headers: {
			Authorization: "Bearer " + Token.access_token,
		},
		json: {
			action: "getactivity",
			data_fields: "steps,distance,calories,totalcalories,hr_average",
			lastupdate: lastUpdate,
		},
	});
  console.log(response.body)
	return response;
};
