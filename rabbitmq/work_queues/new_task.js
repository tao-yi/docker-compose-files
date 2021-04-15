const amqp = require("amqplib");
require("dotenv").config();

const queue = process.env.QUEUE;
const url = process.env.URL;

async function main() {
  const conn = await amqp.connect(url);
  const channel = await conn.createChannel();
  // we declare the queue here, as well. Because we might start the consumer before the publisher,
  // we want to make sure the queue exists before we try to consume messages from it.
  const ok = await channel.assertQueue(queue, {
    /*
    Marking messages as persistent doesn't fully guarantee that a message won't be lost. 
    Although it tells RabbitMQ to save the message to disk, 
    there is still a short time window when RabbitMQ has accepted a message 
    and hasn't saved it yet. Also, RabbitMQ doesn't do fsync(2) for every message -- it may be just saved to cache and not really written to the disk. 
    The persistence guarantees aren't strong, but it's more than enough for our simple task queue. If you need a stronger guarantee then you can use publisher confirms.
    */
    durable: true,
  });
  console.log("ok " + ok);
  for (let i = 0; i < 3; i++) {
    channel.sendToQueue(queue, Buffer.from("num: " + i), {
      // If truthy, the message will survive broker restarts provided it’s in a queue that also survives restarts
      persistent: true,
    });
    console.log(" [x] Sent '%s'", i);
  }
}

main();
