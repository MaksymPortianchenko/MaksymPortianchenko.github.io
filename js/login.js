function getUser() {
    let url = API + '/users/get'
    const login = document.querySelector('#login').value.trim();
    const password = document.querySelector('#password').value.trim();

    const options = {
        method: 'GET',
        headers: {
            'ApiKey': APIKEY,
        }
    }

    url += `?login=${login}&password=${password}`

    fetch(url, options).then(response => response.json())
        .then(response => {
            if (response.statusCode == 409) {
                alert(response.body)
            } else {
                saveToStorage(STORAGE_KEY.USER, response)
                window.location.href = 'index.html';
            }
        })
        .catch(error => alert(error))
}