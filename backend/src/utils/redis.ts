import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL environment variable is not defined');
}

const redis = new Redis(process.env.REDIS_URL, {
  tls: {}, // Upstash uses TLS
  maxRetriesPerRequest: 3,
  lazyConnect: true
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

export default redis;
