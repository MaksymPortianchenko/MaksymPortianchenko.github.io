const registerForm = document.querySelector('.formRegister')

function createUser() {
    const url = API + '/Users/create';
    let login = document.querySelector('#login').value.trim();
    let password = document.querySelector('#password').value.trim();
    let firstName = document.querySelector('#firstName').value.trim();
    let lastName = document.querySelector('#lastName').value.trim();

    if (!login || !password || !firstName || !lastName) {
        alert('Введи все поля')
        return
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ApiKey': APIKEY,
        },
        body: JSON.stringify({ login, password, firstName, lastName })

    }

    fetch(url, options).then(response => response.json())
        .then(response => {
            login = '';
            password = '';
            firstName = '';
            lastName = '';
            if (response.statusCode === 409) {
                alert('Такой пользователь уже существует')
            } else {
                window.location.href = 'login.html';
            }
        })
}