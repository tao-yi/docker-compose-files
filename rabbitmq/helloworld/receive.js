const amqp = require("amqplib");
require("dotenv").config();

const queue = process.env.QUEUE;
const url = process.env.URL;

async function main() {
  const conn = await amqp.connect(url);
  const channel = await conn.createChannel();
  // we declare the queue here, as well. Because we might start the consumer before the publisher,
  // we want to make sure the queue exists before we try to consume messages from it.
  const ok = await channel.assertQueue(queue, { durable: false });
  console.log(ok);
  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
  // server will push us messages asynchronously
  channel.consume(
    queue,
    function (msg) {
      console.log(" [x] Received %s", msg.content.toString());
    },
    {
      noAck: true,
    },
  );
}

main();
