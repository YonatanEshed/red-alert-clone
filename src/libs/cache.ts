import NodeCache from 'node-cache';

const cacheClient = new NodeCache();

function setCache(key: string, experetion: number, data: any) {
    var prevCache: any[] = cacheClient.get(key) || [];

    prevCache.push(data);

    cacheClient.set(key, prevCache, experetion);
}

function getCache(key: string) {
    const value = cacheClient.get(key);
    return value ? value : null;
}

export { setCache, getCache };
