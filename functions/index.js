//"use strict";

const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// データベースの参照を作成
var fireStore = admin.firestore()

// localテスト時に設定
// fireStore.settings({
// 	host: "localhost:8080",
// 	ssl: false,
// });

const request = require("request");
const { fetchWeight, fetchHR, fetchActivity } = require("./fetch.js");

async function readToken(){
    const snapShot = await fireStore
			.collection("token")
			.orderBy("createdAt", "desc")
			.limit(1)
			.get();

		return snapShot.docs[0].data();
};

async function readLastWeightUpdate(){
		const snapShot = await fireStore
			.collection("weight")
			.orderBy("created", "desc")
			.limit(1)
			.get();
		return snapShot.docs[0].data();
};

async function readLastHRUpdate(){
		const snapShot = await fireStore
			.collection("heart_rate")
			.orderBy("created", "desc")
			.limit(1)
			.get();
		return snapShot.docs[0].data();
};

async function fetchData() {
	// currentAccessToken
	const currentToken = await readToken();
	if (!currentToken) {
		return "No Token";
	}

	// ##############################
	// // Weight
	// #############################
	const lastWeightUpdated = await readLastWeightUpdate();
	const wResponse = await fetchWeight(currentToken, lastWeightUpdated);

	// データを取得できたら保存
	if (wResponse.statusCode == 200) {
		// firestoreへの保存
		const wgh = JSON.parse(wResponse.body).body.measuregrps;
		wgh.forEach((grp) => {
			fireStore
				.collection("weight")
				.doc(Number(grp.grpid).toString())
				.set({
					attrib: grp.attrib,
					date: grp.date,
					created: grp.created,
					category: grp.category,
					value: grp.measures[0].value,
					type: grp.measures[0].type,
					unit: grp.measures[0].unit,
					createdAt: admin.firestore.FieldValue.serverTimestamp(),
				})
				.then((newData) => {
					console.log("Document written with ID: ", newData);
				})
				.catch((error) => {
					console.error("Error adding document: ", error);
				});
		});
	}

	// ##############################
	// // HR
	// #############################
	const lastHRUpdated = await readLastHRUpdate();
	const hResponse = await fetchHR(currentToken, lastHRUpdated);

	// データを取得できたら保存
	if (hResponse.statusCode == 200) {
		// firestoreへの保存
		const hrs = JSON.parse(hResponse.body).body.series;
		Object.keys(hrs).forEach((key) => {
			fireStore
				.collection("heart_rate")
				.doc(key)
				.set({
					value: hrs[key].heart_rate,
					created: Number(key),
					model: hrs[key].model,
					model_id: hrs[key].model_id,
					deviceid: hrs[key].deviceid,
					createdAt: admin.firestore.FieldValue.serverTimestamp(),
				})
				.then((newData) => {
					console.log("Document written with ID: ", newData);
				})
				.catch((error) => {
					console.error("Error adding document: ", error);
				});
		});
	}

	// ##############################
	// // Activity
	// #############################
	// 1日前からの更新を取得
	const lastActivityUpdated = Math.floor(Date.now() / 1000 - 60 * 60 * 24 * 1);
	functions.logger.info(lastActivityUpdated, { structuredData: true });
	const aResponse = await fetchActivity(currentToken, lastActivityUpdated);

	// データを取得できたら保存
	if (hResponse.statusCode == 200) {
		// firestoreへの保存
		const acs = JSON.parse(aResponse.body).body.activities;
		acs.forEach((act) => {
			fireStore
				.collection("activity")
				.doc(act.date)
				.set({
					steps: act.steps,
					distance: act.distance,
					calories: act.calories,
					totalcalories: act.totalcalories,
					hr_average: act.hr_average,
					date: act.date,
					createdAt: admin.firestore.FieldValue.serverTimestamp(),
				})
				.then((newData) => {
					console.log("Document written with ID: ", newData);
				})
				.catch((error) => {
					console.error("Error adding document: ", error);
				});
		});
	}
};

// ##############################
// // Scheduler

// ローカルでの挙動確認時はHTTP Requestを叩く
//exports.date = functions.https.onRequest((req, res) => {

exports.fetch = functions.pubsub.schedule("every 30 minutes").onRun((context) => {
		functions.logger.info("fetchData", { structuredData: true });
		fetchData()
			.then(() => {
				return null;
			})
			.catch((err) => {
				console.log(err);
			});
	});

exports.refresh = functions.pubsub.schedule("every 90 minutes").onRun((context) => {
		functions.logger.info("refreshAccessToken", { structuredData: true });
		const currentToken = fireStore
			.collection("token")
			.orderBy("createdAt", "desc")
			.limit(1);

		currentToken.get().then((querySnapshot) => {
			querySnapshot.forEach((token) => {
				if (!token.exists) {
					return "No such document!";
				} else {
					let options = {
						method: "POST",
						url: "https://account.withings.com/oauth2/token",
						headers: {},
						formData: {
							grant_type: "refresh_token",
							client_id: functions.config().withings.client_id,
							client_secret: functions.config().withings.client_secret,
							refresh_token: token.data().refresh_token,
							redirect_uri: functions.config().withings.redirect_uri,
						},
						json: true,
					};
					functions.logger.info(options, { structuredData: true });

					// access tokenのリフレッシュ
					request(options, function (error, response) {
						if (error) throw new Error(error);

						// データを取得できたら保存
						if (response.statusCode == 200) {
							functions.logger.info(response.body, { structuredData: true });
							// firestoreへの保存
							fireStore
								.collection("token")
								.add({
									access_token: response.body.access_token,
									refresh_token: response.body.refresh_token,
									createdAt: admin.firestore.FieldValue.serverTimestamp(),
								})
								.then((newToken) => {
									console.log("Document written with ID: ", newToken.id);
								})
								.catch((error) => {
									console.error("Error adding document: ", error);
								});
						}
					});
				}
			});
		});
		return null;
	});
