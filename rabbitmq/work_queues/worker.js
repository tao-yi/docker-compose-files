const amqp = require("amqplib");
require("dotenv").config();

const queue = process.env.QUEUE;
const url = process.env.URL;

async function main() {
  const conn = await amqp.connect(url);
  const channel = await conn.createChannel();
  // we declare the queue here, as well. Because we might start the consumer before the publisher,
  // we want to make sure the queue exists before we try to consume messages from it.
  channel.assertQueue(queue, {
    // ensure that messages aren't lost if RabbitMQ node restart
    // This durable option needs to be applied to both the producer and consumer code.
    durable: true,
  });
  // server will push us messages asynchronously
  channel.consume(
    queue,
    function (msg) {
      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(() => {
        console.log(" [x] Done: " + Date.now());
        // If a consumer dies (its channel is closed, connection is closed, or TCP connection is lost) without sending an ack
        // RabbitMQ will understand that a message wasn't processed fully and will re-queue it
        // It's a common mistake to miss the ack. It's an easy error, but the consequences are serious.
        // Messages will be redelivered when your client quits (which may look like random redelivery),
        // but RabbitMQ will eat more and more memory as it won't be able to release any unacked messages.
        channel.ack(msg);
      }, 3000);
    },
    {
      // if true, the broker won’t expect an acknowledgement of messages delivered to this consumer;
      // i.e., it will dequeue messages as soon as they’ve been sent down the wire. Defaults to false
      noAck: false,
    },
  );
}

main();
