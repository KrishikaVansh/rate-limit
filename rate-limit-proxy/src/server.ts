import express from 'express';
import { ipRateLimitMiddleware, apiKeyRateLimitMiddleware } from './middleware';

const app = express();
app.use(express.json());

// 1. IP Rate Limiting
app.use(ipRateLimitMiddleware);

// 2. API Key Rate Limiting (Usage Quotas)
app.use(apiKeyRateLimitMiddleware);

// 3. API Key Authentication 
//  this checks your database to see if the key exists and is active.(example only)
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    
    if (apiKey === 'secure-server-key-123') {
        next(); // Authorized
    } else {
        res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }
};

app.use(authMiddleware);

// 4. Authorization & Controller 
app.get('/api/resource', (req, res) => {
   
    res.json({ data: 'This is protected data', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy Server running on port ${PORT}`);
});