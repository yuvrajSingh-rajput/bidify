// queue.js
const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis();

const messageQueue = new Queue('messages', { connection });

module.exports = { messageQueue, Worker, connection };
