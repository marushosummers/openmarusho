# [open marusho](https://open.marusho.io/admin/dashboard)

<img width="1149" alt="open-marusho" src="https://user-images.githubusercontent.com/32977282/119448518-6bf0e880-bd6c-11eb-9d7d-219d2b2145ee.png">

====

[Withings API](https://developer.withings.com/oauth2/)より取得したヘルスデータを確認できる[marusho](https://github.com/marushosummers)個人用ダッシュボード

[Ken Kawamoto氏](https://open-ken.web.app/)の[OpenKen](https://open-ken.web.app/)に多大な影響を受けて制作致しました。

## Requirement

- firebase
- React.js

### Dashboard Template
- [Material Dashboard React](https://github.com/creativetimofficial/material-dashboard-react)
- [CHARTIST.js](https://gionkunz.github.io/chartist-js/index.html)
## Usage

- 開発環境の起動

```
make
```

- 開発環境に入る

```
make enter
```


- 開発環境を止める


```
make stop
```

- ローカルのデータを使ってfirebase emulatorsを起動

```
firebase emulators:start --import=<data-path> --export-on-exit
```

### dashboard

- reactの起動
```
cd dashboard
npm run start
```

## Deploy

### Firebase login

- Dockerからログインする際は`--no-localhost`オプションを利用する

```
firebase login --no-localhost
```

### dashboard deploy

- build
```
npm run build
```

- deploy

```
firebase deploy --only hosting
```

### functions deploy

```
firebase deploy --only functions:<function name>
```

