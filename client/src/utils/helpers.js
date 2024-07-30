// helpers.js

export async function uploadImage(imageFile) {
    const apiEndpoint = '/api/upload-image'; 

    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(apiEndpoint, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Image uploaded successfully', result);
            if (result && result.url) {
                return result.url
            } else {
                return "https://via.placeholder.com/150";
            }
        } else {
            console.error('Error uploading image to API:', response.statusText);
            return "https://via.placeholder.com/150";
        }
    } catch (error) {
        console.error('Error uploading image to API:', error);
        return "https://via.placeholder.com/150";
    }
}

export function pluralize(name, count) {
    if (count === 1) { return name; }
    return name + 's';
}

export function idbPromise(storeName, method, object) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('shop-shop', 1);
        let db, tx, store;
        request.onupgradeneeded = function (e) {
            const db = request.result;
            db.createObjectStore('products', { keyPath: '_id' });
            db.createObjectStore('categories', { keyPath: '_id' });
            db.createObjectStore('cart', { keyPath: '_id' });
        };

        request.onerror = function (e) {
            console.log('There was an error');
        };

        request.onsuccess = function (e) {
            db = request.result;
            tx = db.transaction(storeName, 'readwrite');
            store = tx.objectStore(storeName);

            db.onerror = function (e) {
                console.log('error', e);
            };

            switch (method) {
                case 'put':
                    store.put(object);
                    resolve(object);
                    break;
                case 'get':
                    const all = store.getAll();
                    all.onsuccess = function () {
                        resolve(all.result);
                    };
                    break;
                case 'delete':
                    store.delete(object._id);
                    break;
                default:
                    console.log('No valid method');
                    break;
            }

            tx.oncomplete = function () {
                db.close();
            };
        };
    });
}
