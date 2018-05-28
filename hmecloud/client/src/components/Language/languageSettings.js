export function getCurrentLanguage () {
  let language = navigator.language ? navigator.language : 'en-US'
  let languageSelected = 0
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
