//"use strict";

const fs = require("fs");

const express = require('express')
const request = require("request");
const app = express()
app.listen(3000, '0.0.0.0');

// TODO: respositoryに置き換える
const TOKEN = JSON.parse(fs.readFileSync("./token.json", "utf8"))
const CONFIG = JSON.parse(fs.readFileSync("./config.json", "utf8"))


app.get('/health', (req, res) => {
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
      fs.writeFileSync("./output.json", JSON.stringify(response.body));
    });
});

app.get("/refresh", (req, res) => {
    refreshAccessToken();
    res.send("ok");
});

const refreshAccessToken = () => {
  let options = {
		method: "POST",
		url: "https://account.withings.com/oauth2/token",
		headers: {},
		formData: {
			grant_type: "refresh_token",
			client_id: CONFIG.client_id,
			client_secret: CONFIG.client_secret,
			refresh_token: TOKEN.refresh_token,
			redirect_uri: CONFIG.redirect_uri,
		},
	};
    console.log(options);

  // access tokenのリフレッシュ
  request(options, function (error, response) {
		if (error) throw new Error(error);
		// データの保存
    if (response.statusCode == 200) {
		  fs.writeFileSync("./token.json", response.body);
    };
    console.log(response.body);
	});
};

