//"use strict";

const functions = require("firebase-functions");
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// データベースの参照を作成
var fireStore = admin.firestore()

const request = require("request");

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.weight = functions.https.onRequest((req, res) => {
    // access_tokenの設定
    let options = {
			method: "GET",
			url: "https://wbsapi.withings.net/measure",
			qs: {
				action: "getmeas",
				meastype: 1,
				cateegory: 1,
        access_token: TOKEN.access_token,
			},
			headers: {},
		};

    // 体重データの取得
    request(options, function (error, response) {
      if (error) throw new Error(error);
      res.send(response.body);

      // データの保存
    });
});

exports.refresh = functions.https.onRequest((req, res) => {
  functions.logger.info("refreshAccessToken", {structuredData: true});
  const currentToken = fireStore.collection('token_test').doc('token');

  currentToken.get().then(token => {
      if (!token.exists) {
      return 'No such document!'
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
        functions.logger.info(options, {structuredData: true});
        // access tokenのリフレッシュ
        request(options, function (error, response) {
            if (error) throw new Error(error);
            // データを取得できたら保存
            if (response.statusCode == 200) {
                functions.logger.info(response.body, {structuredData: true});
                // firestoreへの保存
                fireStore.collection("token").add({
                    access_token: response.body.access_token,
                    refresh_token: response.body.refresh_token,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                }).then((newToken) => {
                    console.log("Document written with ID: ", newToken.id);
                    res.send("REFRESH!")
                }).catch((error) => {
                    console.error("Error adding document: ", error);
                });
                }
                });
        };
  });
  res.send("REFRESH?")
});
