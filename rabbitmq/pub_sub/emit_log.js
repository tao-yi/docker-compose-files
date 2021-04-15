const amqp = require("amqplib");
require("dotenv").config();

const url = process.env.URL;
/*
The core idea in the messaging model in RabbitMQ is that the producer never sends any messages directly to a queue. 
Actually, quite often the producer doesn't even know if a message will be delivered to any queue at all.

The producer can only send messages to an exchange. 
An exchange is a very simple thing. 
On one side it receives messages from producers and the other side it pushes them to queues
*/
async function main() {
  const conn = await amqp.connect(url);
  const channel = await conn.createChannel();
  const exchange = "logs";
  let ok = await channel.assertExchange(exchange, "fanout", {
    durable: false,
  });
  console.log(ok);
  const msg = "hello pub_sub " + new Date().toISOString();
  channel.publish(exchange, "", Buffer.from(msg));
  console.log(" [x] Sent %s", msg);
}

main();
