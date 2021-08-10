
import redis from 'redis';
import redisConfig from '../config/redis';

const client = redis.createClient(redisConfig);

//inserir dados no redis
const setCache = (key: string, value: string, time: number): 
Promise<boolean> => {
  return new Promise((resolve, reject) => {
    client.set(key, value, 'ex', time, (err) => {
      if (err)
        reject(err);
      resolve(true);
    });
  });
};

//obter dados do redis
const getCache = (key: string):
Promise<string> => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, value) => {
      if (err)
        reject(err);
      resolve(value);
    });
  });
};

//deletar dados do redis
const destroyCache = (key: string):
Promise<number> => {
  return new Promise((resolve, reject) => {
    client.DEL(key, (err, value) => {
      if (err)
        reject(err);
      resolve(value);
    });
  });
};

export { setCache, getCache, destroyCache };