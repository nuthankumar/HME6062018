export function getCurrentLanguage() {
    return  localStorage.getItem('currentLanguage')?localStorage.getItem('currentLanguage'):0;
  }
  
export function setCurrentLanguage(x) {
    let languageSelected = 0; 
    switch (x) { 
        case "en": 
            languageSelected = 0; 
            break; 
        case "fr": 
            languageSelected = 1; 
            break; 
    } 
    localStorage.setItem('currentLanguage', languageSelected );
  }