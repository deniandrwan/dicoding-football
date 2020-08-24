var webPush = require("web-push");

const vapidKeys = {
  publicKey:
    "BPgnUnIhyTCDViDQV9XKvI02limoppkFEILNMY93WlJgbGYrW9uPmPmHP_EW23wv8oy8mAzEU2uIUujCRFYNmP8",
  privateKey: "1SueflDregR7VOY4tH62plWQv5aEArVKKDioGAPs_0Y",
};

webPush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const pushSubscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/c63Z6lEdNCo:APA91bHrRW7wLDDXOQTtDicJxUoywCC8Tn1ua0qEBq2GZYSC7qG4G45AEv13zCntuglaFexmel0B185Xe8fkOiRJQw4w-I0_ldBcOq8Il3Z5i09ASY8MqdgTLl1ub4_Ewx0b-83pZSQW",
  keys: {
    p256dh:
      "BAewve/4SQyJA59HALK8cBEhXtqmVuGAj2mg4P7uRXtyoqtxgsp3DLPIncE8WAjTXXWWzxoLkELVC3bg0JteUlo=",
    auth: "hUmgv0ngY8vWAqLlvwra9g==",
  },
};

const payload = "Hore! Aplikasi Anda sudah dapat menerima push notifikasi!";

const options = {
  gcmAPIKey: "478965580771",
  TTL: 60,
};

webPush.sendNotification(pushSubscription, payload, options);
