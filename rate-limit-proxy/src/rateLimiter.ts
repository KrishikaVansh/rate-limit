import { RateLimiterRedis } from 'rate-limiter-flexible';
import redisClient from './redisClient';

// 1. IP Rate Limiter (DDoS Protection)
// Allow 20 requests per second per IP
export const ipLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_ip',
  points: 20, 
  duration: 1, 
});

// 2. API Key Rate Limiter (Business Logic)
// Allow 100 requests per minute per API Key
export const apiKeyLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_apikey',
  points: 100,
  duration: 60,
});