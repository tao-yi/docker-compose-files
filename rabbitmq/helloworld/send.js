const amqp = require("amqplib");

const url = "amqp://admin:admin@localhost:5673";
const queue = "hello";

async function main() {
  const conn = await amqp.connect(url, {});
  const channel = await conn.createChannel();
  // Declaring a queue is idempotent - it will only be created if it doesn't exist already.
  const msg = "hello world";
  await channel.assertQueue(queue, {
    //  if true, the queue will survive broker restarts, defaults to true
    durable: false,
  });
  // The message content is a byte array, so you can encode whatever you like there.
  const res = channel.sendToQueue(queue, Buffer.from(msg));
  console.log(res);
  await channel.close();
  await conn.close();
}

main();
