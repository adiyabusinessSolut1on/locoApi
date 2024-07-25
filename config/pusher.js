const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '1839597',
  key: "a4d3a0c286777e1f76c7",
  secret: "8e1a49f298ee00d72cc6",
  cluster: "ap2",
  useTLS: true,
});

module.exports = pusher;