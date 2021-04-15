const amqp = require("amqplib");
require("dotenv").config();

const url = process.env.URL;

async function main() {
  const conn = await amqp.connect(url);
  const channel = await conn.createChannel();
  const exchange = "logs";

  // fanout: broadcasts all the messages it receives to all the queues it knows
  await channel.assertExchange(exchange, "fanout", {
    durable: false,
  });

  // when we supply queue name as an empty string, we create a non-durable queue with a generated name:
  const ok = await channel.assertQueue("", {
    exclusive: true,
  });
  console.log(ok);

  channel.bindQueue(ok.queue, exchange, "");

  channel.consume(
    ok.queue,
    function (msg) {
      if (msg.content) {
        console.log(" [x] %s", msg.content.toString());
      }
    },
    {
      noAck: true,
    },
  );
}

main();
