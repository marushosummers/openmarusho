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

exports.weight = functions.pubsub.schedule("every 5 minutes").onRun((context) => {
		functions.logger.info("fetchWeight", { structuredData: true });
		const currentTokenRef = fireStore
			.collection("token")
			.orderBy("createdAt", "desc")
			.limit(1);
		const lastupdateRef = fireStore
			.collection("weight")
			.orderBy("created", "desc")
			.limit(1);

		// access tokenとlastupdateで新しいデータを取得
		currentTokenRef.get().then((currentTokens) => {
			currentTokens.forEach((token) => {
				lastupdateRef.get().then((lastupdates) => {
					lastupdates.forEach((lastupdate) => {
						// functions.logger.info(token, {structuredData: true});
						if (!token.exists) {
							return "No such document!";
						} else {
							// access_tokenの設定
							let options = {
								method: "GET",
								url: "https://wbsapi.withings.net/measure",
								qs: {
									action: "getmeas",
									meastype: 1,
									cateegory: 1,
									access_token: token.data().access_token,
									lastupdate: lastupdate.data().created + 1,
								},
								headers: {},
								json: true,
							};
							functions.logger.info(options, { structuredData: true });

							// 体重データの取得
							request(options, function (error, response) {
								if (error) throw new Error(error);

								// データを取得できたら保存
								if (response.statusCode == 200) {
									functions.logger.info(response.body, {
										structuredData: true,
									});
									// firestoreへの保存
									response.body.body.measuregrps.forEach((grp) => {
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
												console.log("Document written with ID: ", newData.id);
											})
											.catch((error) => {
												console.error("Error adding document: ", error);
											});
									});
								}
							});
						}
					});
				});
			});
		});
    return null;
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
