export function isAdmin() {
    if (localStorage.getItem("isAdmin")){
        return localStorage.getItem("isAdmin");
    }
    else {
        return false;
    }

}

export function isLoggedIn() {
    return localStorage.getItem("token") ? true : false;
}


export function getToken() {
    return localStorage.getItem("token");
}

export function clearToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
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

