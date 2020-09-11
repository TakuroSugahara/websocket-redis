const ws = require('ws');
const redis = require('redis');
const server = new ws.Server({port: 5001});

const subscriber = redis.createClient(6379, 'redis')
const publisher = redis.createClient(6379, 'redis')

subscriber.subscribe('SUBSCRIBE_CHANNEL');

subscriber.on("message", function(channel, message) {
  server.clients.forEach(client => {
    client.send(message);
  });
});

// 接続時に呼ばれる
server.on('connection', ws => {
  // クライアントからのデータ受信時に呼ばれる
  ws.on('message', message => {
    console.log(message);
    publisher.publish('SUBSCRIBE_CHANNEL', message)
  });

  // 切断時に呼ばれる
  ws.on('close', () => {
    console.log('close');
  });
});
