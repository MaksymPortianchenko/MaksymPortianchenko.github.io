const STORAGE_KEY = {
    USER: 'user'
}

function getFromStorage(name) {
    return JSON.parse(localStorage.getItem(name));
}

function saveToStorage(name, value) {
    localStorage.setItem(name, JSON.stringify(value))

    if (name == STORAGE_KEY.USER) {
        updateUser(getFromStorage(STORAGE_KEY.USER));
    }
}

function deleteStorageItem(name) {
    localStorage.removeItem(name);
}