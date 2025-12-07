import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Singleton Redis Client
const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  enableOfflineQueue: false, // Fail fast if Redis is down
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

export default redisClient;