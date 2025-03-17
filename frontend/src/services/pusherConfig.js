// import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Channel = Lawyer 2 development
let pusherAppKeys = {
  app_id: "1796195",
  key: "823716bade3c868d2516",
  secret: "78001136ac77fbc4b6f2",
  cluster: "ap2"
}

// Channel = Lawyer 
// let pusherAppKeys = {
//   app_id: "1644390",
//   key: "f003ced16e0ef4d30160",
//   secret: "c1a7f6f5d2b0d8a89962",
//   cluster: "ap2"
// }


export const pusher = new Pusher(pusherAppKeys.key, {
  cluster: pusherAppKeys.cluster,
  forceTLS: true,
  logToConsole: false,
});

