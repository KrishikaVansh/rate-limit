import { Request, Response, NextFunction } from 'express';
import { ipLimiter, apiKeyLimiter } from './rateLimiter';

// Middleware 1: Rate Limit by IP (First line of defense)
export const ipRateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ipLimiter.consume(req.ip!); // Consume 1 point
    next();
  } catch (rejRes) {
    res.status(429).json({ error: 'Too Many Requests from this IP' });
  }
};

// Middleware 2: Rate Limit by API Key (Before Auth Logic)
export const apiKeyRateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
     // If no key is present, we can't rate limit by it yet. 
     // Usually, we block here, or let the Auth middleware handle the missing key.
     // For this flow, we proceed to Auth which will reject it.
     return next();
  }

  try {
    // Note: We are consuming points BEFORE verifying if the key is valid in DB.
    // This protects the DB from being hammered by a valid formatted but unauthorized key.
    await apiKeyLimiter.consume(apiKey); 
    next();
  } catch (rejRes) {
    res.status(429).json({ error: 'API Key Rate Limit Exceeded' });
  }
};