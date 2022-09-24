const PREFIX = "V4"
//Self refers to the service worker
self.addEventListener('install', () => {
    //Don't wait for the processes of the previous sw to be stopped to activate the new version. 
    //Stop them and activate the new version directly.
    self.skipWaiting();
    console.log(`${PREFIX} Install`)
})

self.addEventListener('activate', () => {
    //Automatically control the page when the sw is activated
    clients.claim();
    console.log(`${PREFIX} Active`)
})

self.addEventListener('fetch', (event) =>{
    console.log(
        `${PREFIX} Fetching: ${event.request.url}, Mode: ${event.request.
        mode}`
    );
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
                    return new Response("Bonjour");
                }
            })()
        );
    }
});