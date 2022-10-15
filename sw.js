const PREFIX = "V1"

const CACHED_FILES = ["https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css"];

//Self refers to the service worker
self.addEventListener('install', (event) => {
    //Don't wait for the processes of the previous sw to be stopped to activate the new version. 
    //Stop them and activate the new version directly.
    self.skipWaiting();
    event.waitUntil(
        (async () => {
            const cache = await caches.open(PREFIX);
            await Promise.all([...CACHED_FILES, 'offline.html'].map(path =>{
                return cache.add(new Request(path))
            }))
        })()
    )
    console.log(`${PREFIX} Install`)
})

self.addEventListener('activate', (event) => {
    //Automatically control the page when the sw is activated
    clients.claim();

    //Flush other cache keys when this version of the sw becomes active
    event.waitUntil(
        (async() => {
            const keys = await caches.keys();
            //Wait for all keys to be deleted to continue
            await Promise.all(
                keys.map(key => {
                    if(!key.includes(PREFIX)){
                        return caches.delete(key);
                    }
                })
            )
        })()
    )
    console.log(`${PREFIX} Active`)
})

self.addEventListener('fetch', (event) =>{
    console.log(
        `${PREFIX} Fetching: ${event.request.url}, Mode: ${event.request.
        mode}`
    )
    if(event.request.mode === "navigate"){
        event.respondWith(
            (async () => {
                try{
                    const preloadResponse = await event.preloadResponse
                    if(preloadResponse){
                        return preloadResponse
                    }
                    //Acces to the request by the network
                    return await fetch(event.request)
                } catch(e){
                    //Return this response only when offline
                    const cache = await caches.open(PREFIX);
                    return await cache.match('offline.html');
                }
            })()
        )
    } else if(CACHED_FILES.includes(event.request.url)){
        event.respondWith(caches.match(event.request))
    }
});