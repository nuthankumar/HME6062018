export function isAdmin() {
    return localStorage.getItem("isAdmin") ? localStorage.getItem("isAdmin"): false;
}

export function isLoggedIn() {
    return localStorage.getItem("token") ? true : false;
}







export function getUserUid() {
    let language = navigator.language ? navigator.language : 'en-US'
    let languageSelected = 0;
    switch (language) {
        case 'en-US':
            languageSelected = 0
            break
        case 'fr-CA':
            languageSelected = 1
            break
        default:
            languageSelected = 0
            break
    }

    return languageSelected
}

