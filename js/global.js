const links = document.querySelectorAll('.menu__footer-link');
const footerLinks = document.querySelectorAll('.menu__footer-link')

let user = getFromStorage(STORAGE_KEY.USER);

function updateUser(newUser) {
    user = newUser;
}

if (window.location.href.split('/')[3] === '') {
     links[0].classList.add('current')
    footerLinks[0].classList.add('current')
} else {
    showCurrentPage()
}

function showCurrentPage() {
    links.forEach((el, index) => {
        if (window.location.href.includes(el.href)) {
            el.classList.toggle('current')
            footerLinks.forEach(element => {
                if (element.classList.contains('current')) {
                    element.classList.remove('current')
                }
            })
            footerLinks[index].classList.add('current')
        }
    })
}

const header = document.querySelector('header')

if (true) {
    let prevScrollPos = window.pageYOffset;

    window.onscroll = function () {
        let currentScrollPos = window.pageYOffset;
        if (prevScrollPos > currentScrollPos) {
            header.style.transform = 'translateY(0)';
        } else {
            header.style.transform = 'translateY(-500%)';
        }

        prevScrollPos = currentScrollPos;
    };
}

checkUserData()
function checkUserData() {
    if (!user) {
        if (!window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
            window.location.href = 'login.html'
        }
    }
}

function logOut() {
    deleteStorageItem(STORAGE_KEY.USER)
    window.location.reload()
}

if (user?.image) {
    document.querySelectorAll('.ava').forEach(el => {
        el.style.display = 'block';
    });

    document.querySelectorAll('.avaHeader').forEach(el => {
        el.src = `data:image/png;base64,${user.image}`;
    });

    document.querySelectorAll('.svgProfile').forEach(el => {
        el.style.display = 'none';
    })

    document.querySelectorAll('.profile__name').forEach(el => {
        el.innerHTML = user.login;
    })
}

document.querySelectorAll('.profile__name').forEach(el => {
    el.innerHTML = user.login;
})

document.addEventListener('click', function(event) {

    const targetElement = event.target;

    if (targetElement.classList.contains('logo') || targetElement.querySelector('.logo svg') || targetElement.querySelector('.logo path') || targetElement.closest('.logo')) {
        const sideMenu = document.querySelector('.side__menu')
        sideMenu.style.transform = 'translateX(0)';
    }
});

document.addEventListener('click', function(event) {
    const targetElement = event.target;

    if (targetElement.classList.contains('close') || targetElement.querySelector('.close__line') || targetElement.querySelector('.close__line .close__line_1') || targetElement.querySelector('.close__line .close__line_2') || targetElement.closest('.close')) {
        const sideMenu = document.querySelector('.side__menu')
        sideMenu.style.transform = 'translateX(-200%)';
    }
});