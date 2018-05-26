import React from 'react'
import '../Footer/Footer.css'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import { Config } from '../../Config'
import AuthenticationService from '../Security/AuthenticationService'

export default class Footer extends React.Component {
  constructor (props) {
    super(props)
    this.authService = new AuthenticationService(Config.authBaseUrl)
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage(),
      token: this.authService.getToken()
    }
    this.state.url = this.authService.getColdFusionAppUrl(this.authService.isAdmin())
  }
  render () {
    const language = this.state.currentLanguage
    const { token, url } = this.state
    return (<div >
      <div id='Footer'>
        <div className='copyright'>
          <span><b>HM Electronics, Inc. &copy;2018 </b>
   |
            <a className='terms black_link' href={url + 'images/' + t[language].useragreementUrl + '?token=' + token} target='_blank'>{t[language].useragreement}</a>
                    |
            <a className='privacy black_link' href={url + 'images/' + t[language].privacypolicyUrl + '?token=' + token} target='_blank'>{t[language].privacypolicy}</a>
    |
            <a className='supply black_link' href={url + 'images/' + t[language].californiasupplyUrl + '?token=' + token} target='_blank'>{t[language].californiasupply}</a>
                    |
            <a className='cookie black_link' href={url + 'images/' + t[language].cookiepolicyUrl + '?token=' + token} target='_blank'>{t[language].cookiepolicy}</a>
          </span></div>
      </div>
    </div>)
  }
}
