document.querySelector('#avaImg').src = `data:image/png;base64,${user.image}`
document.querySelector('#nameAndLastName').innerHTML = `${user.firstName} ${user.lastName}`;
document.querySelector('#phoneTitle').innerHTML = user.phone;


document.addEventListener("click", function (event) {
    if (!event.target.classList.contains('sub-button')) return

    const clickedElement = event.target;
    const settingsWrapperToToggle = clickedElement.closest('.settings__edit').nextElementSibling

    settingsWrapperToToggle.classList.toggle('active')

    if (settingsWrapperToToggle.classList.contains('active') && !settingsWrapperToToggle.classList.contains('password_wrapper')) {
        clickedElement.innerHTML = 'Скасувати'
    } else {
        clickedElement.innerHTML = 'Змінити'
    }

    if(settingsWrapperToToggle.classList.contains('password_wrapper') && settingsWrapperToToggle.classList.contains('active')) {
        clickedElement.innerHTML = 'Скасувати'
    } else if (settingsWrapperToToggle.classList.contains('password_wrapper') && !settingsWrapperToToggle.classList.contains('active')) {
        clickedElement.innerHTML = 'Змінити пароль'
    }
});


function updateAvatar() {
    const file = document.querySelector('#avatar').files[0];
    const url = API + `/users/update/${user.login}`

    var reader = new FileReader();
    reader.onload = function (event) {
        const imageData = event.target.result;
        const imageBase64 = convertImageToBase64(imageData)

        const patchData = [
            {
                op: "replace",
                path: "image",
                value: imageBase64
            }
        ];

        const params = {
            method: "PATCH",
            headers: {
                "apikey": APIKEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(patchData)
        }

        fetch(url, params).then(response => response.json())
            .then(response => {

                if (response.statusCode === 409) {
                    alert(response.body)
                } else {
                    saveToStorage(STORAGE_KEY.USER, response);
                    document.querySelector('#avaImg').src = `data:image/png;base64,${response.image}`;
                }
            })
    };

    reader.readAsArrayBuffer(file);
}

function convertImageToBase64(imageData) {
    const bytes = new Uint8Array(imageData);
    let binary = "";
    for (var i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
}

const firstNameInput = document.querySelector('#firstNameInput');
const lastNameInput = document.querySelector('#lastNameInput');

const names = [firstNameInput, lastNameInput]

names.forEach(el => {
    el.addEventListener('keydown', function(event) {
        if (event.key >= 0 && event.key <= 9) {
          event.preventDefault();
        }
      });
})

const pattern = /[123456789<>"\[\]\{\}]/;

let titleGlobal,
    loaderGlobal;

function saveFirstAndLastName() {
    if (firstNameInput.length >= 30 || lastNameInput.value.length >= 30) {
        alert("Ім'я або прізвище не має перевищувати 30 символів!"); 
        return;
    }

    if (firstNameInput.value.length == 0 || lastNameInput.value.length == 0) {
        alert("Введіть коректне ім'я або прізвище. Не має бути пустих строк!"); 
        return;
    }

    if (pattern.test(firstNameInput.value) || pattern.test(lastNameInput.value)) {
        alert("Ім'я та прізвище не може містити символи ([123456789<>'\[\]\{\}])"); 
        return;
    }


    
    user.firstName = document.querySelector('#firstNameInput').value;
    user.lastName = document.querySelector('#lastNameInput').value;

    //Функціонал з лоадером

    document.addEventListener('click', function(event) {
        if(event.target.classList.contains('button')) {
            const title = event.target.parentElement.previousElementSibling.querySelector('.load');
            const loader = event.target.parentElement.previousElementSibling.querySelector('.loader');

            title.classList.toggle('disabled');
            loader.classList.toggle('disabled');


        }
    })
    

    const url = API + `/users/update/${user.login}`

    const patchData = [
        {
            op: "replace",
            path: "firstname",
            value: document.querySelector('#firstNameInput').value.trim()
        },
        {
            op: "replace",
            path: "lastname",
            value: document.querySelector('#lastNameInput').value.trim()
        }
    ];

    const params = {
        method: "PATCH",
        headers: {
            "apikey": APIKEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(patchData)
    }

    fetch(url, params).then(response => response.json())
        .then(response => {
            saveToStorage(STORAGE_KEY.USER, response);
            document.querySelector('#nameAndLastName').innerHTML = `${response.firstName} ${response.lastName}`;
            document.querySelector('#nameAndLastName').classList.toggle('disabled');
            document.querySelector('#nameAndLastName').nextElementSibling.classList.toggle('disabled');
        })
}

function savePassword() {
    document.addEventListener('click', function(event) {
        if(event.target.classList.contains('button')) {
            const title = event.target.parentElement.querySelector('.load');
            const loader = event.target.parentElement.querySelector('.loader');

            title.classList.toggle('disabled');
            loader.classList.toggle('disabled');


        }
    })

    const url = API + `/users/update/${user.login}`

    const patchData = [
        { op: "replace", path: "password", value: document.querySelector('#password').value }
    ];

    const params = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "apikey": APIKEY
        },
        body: JSON.stringify(patchData)
    }

    fetch(url, params).then(response => response.json())
        .then(response => {
            saveToStorage(STORAGE_KEY.USER, response);
            alert('Пароль успішно змінено!');
            document.querySelector('.password_wrapper').querySelector('.load').classList.remove('disabled');
            document.querySelector('.password_wrapper').querySelector('.loader').classList.add('disabled');
        })

    document.querySelector('#password').value = ''
}

var phoneInput = document.getElementById('phoneInput');

phoneInput.addEventListener('input', function(event) {
  var inputValue = event.target.value;
  
  // Видаляємо всі символи, крім цифр
  var cleanedValue = inputValue.replace(/\D/g, '');
  
  // Обмежуємо введення до 10 цифр
  if (cleanedValue.length > 10) {
    cleanedValue = cleanedValue.slice(0, 10);
  }
  
  // Форматуємо номер телефону (наприклад, 1234567890 -> (123) 456-7890)
  var formattedValue = formatPhoneNumber(cleanedValue);
  
  event.target.value = formattedValue;
});

function formatPhoneNumber(value) {
  var formattedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  return formattedValue;
}



function saveMobile() {

    document.addEventListener('click', function(event) {
        if(event.target.classList.contains('button')) {
            const title = event.target.parentElement.previousElementSibling.querySelector('.load');
            const loader = event.target.parentElement.previousElementSibling.querySelector('.loader');

            title.classList.toggle('disabled');
            loader.classList.toggle('disabled');


        }
    })

    document.querySelector('#phoneInput').innerHTML = user.phone;

    if (document.querySelector('#phoneInput').value.length < 10) {
        alert('Введіть правильний номер телефону!'); 
        return;
    }

    const url = API + `/users/update/${user.login}`

    const patchData = [
        { op: "replace", path: "phone", value: document.querySelector('#phoneInput').value }
    ];

    const params = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "apikey": APIKEY
        },
        body: JSON.stringify(patchData)
    }

    fetch(url, params).then(response => response.json())
        .then(response => {
            saveToStorage(STORAGE_KEY.USER, response);
            document.querySelector('#phoneTitle').innerHTML = response.phone;
            document.querySelector('#phoneTitle').classList.toggle('disabled');
            document.querySelector('#phoneTitle').nextElementSibling.classList.toggle('disabled');
        })

    document.querySelector('#phoneInput').value = ''
}