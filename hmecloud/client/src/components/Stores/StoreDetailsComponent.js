import React, { Component } from 'react'
import './Stores.css'
import t from '../Language/language'
import StoreMerge from './StoreMerge'
import * as languageSettings from '../Language/languageSettings'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { BrowserRouter as Router, Route, Link, hashHistory, IndexRoute, Switch } from 'react-router-dom'
import * as modalAction from '../../actions/modalAction'
class StoreDetailsComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage(),
      showStores: this.props.showStores,
      show: false
    }
    this.storeTabs = this.storeTabs.bind(this)
    this.mergePopUp = this.mergePopUp.bind(this)
  }

  mergePopUp() {
    this.setState({
      show: true
    })
    this.props.dispatch(modalAction.closePopup())
    this.props.dispatch(modalAction.mergeOpenPopup())
  }

  storeTabs() {
    if (this.props.isAdmin) {
      return (
        <div>To merge and/or remove duplicates <a href='#' onClick={this.mergePopUp}> click here</a></div>
      )
    }
  }

  render() {
    const language = this.state.currentLanguage
    // {t[language].}
    return (
      <div>
        <table className='user_form'>
          <tbody>
            <tr>
              <th><label for='Store_Brand_ID'>{t[language].settingsStoresCIBBrand}: <span class='redText'>*</span></label></th>
              <td>
                <select name='Store_Brand_ID' id='Store_Brand_ID' disabled='disabled'>
                  <option value="Checker's" selected='selected'>Checker's</option>
                  <option value='Dairy Queen' selected='selected'>Dairy Queen</option>
                  <option value='Del Taco' selected='selected'>Del Taco</option>
                  <option value="Dunkin' Donuts" selected='selected'>Dunkin' Donuts</option>
                  <option value='KFC' selected='selected'>KFC</option>
                  <option value="Popeye's" selected='selected'>Popeye's</option>
                  <option value='Taco Bell' selected='selected'>Taco Bell</option>
                  <option value="Wendy's" selected='selected'>Wendy's</option>
                  <option value="Arby's" selected='selected'>Arby's</option>
                  <option value='A&amp;W' selected='selected'>A&amp;W</option>
                  <option value='Burger King' selected='selected'>Burger King</option>
                  <option value='El Pollo Loco' selected='selected'>El Pollo Loco</option>
                  <option value="Hardee's" selected='selected'>Hardee's</option>
                  <option value='In-N-Out Burger' selected='selected'>In-N-Out Burger</option>
                  <option value='Jack in the Box' selected='selected'>Jack in the Box</option>
                  <option value='Long John Silver' selected='selected'>Long John Silver</option>
                  <option value="McDonald's" selected='selected'>McDonald's</option>
                  <option value="Rally's" selected='selected'>Rally's</option>
                  <option value='Starbucks' selected='selected'>Starbucks</option>
                  <option value='Taco Bueno' selected='selected'>Taco Bueno</option>
                  <option value='Tim Horton' selected='selected'>Tim Horton</option>
                  <option value='Other' selected='selected'>Other</option>
                  <option value='Subway' selected='selected'>Subway</option>
                  <option value='None' selected='selected'>None</option>
                  <option value="Carl's Jr." selected='selected'>Carl's Jr.</option>
                  <option value="Bojangles'" selected='selected'>Bojangles'</option>
                  <option value='Boston Market' selected='selected'>Boston Market</option>
                  <option value="Braum's" selected='selected'>Braum's</option>
                  <option value='Chick-fil-A' selected='selected'>Chick-fil-A</option>
                  <option value="Church's" selected='selected'>Church's</option>
                  <option value="Harvey's" selected='selected'>Harvey's</option>
                  <option value='Krystal' selected='selected'>Krystal</option>
                  <option value='Panda Express' selected='selected'>Panda Express</option>
                  <option value='Panera Bread' selected='selected'>Panera Bread</option>
                  <option value="Seattle's Best Coffee" selected='selected'>Seattle's Best Coffee</option>
                  <option value='Taco Time' selected='selected'>Taco Time</option>
                  <option value='White Castle' selected='selected'>White Castle</option>
                </select>
              </td>
            </tr>
            <tr>
              <th><label for='Store_Name'> {t[language].settingsStoresStoreName}:</label></th>
              <td><input type='text' maxLength='100' name='Store_Name' id='Store_Name' value='' disabled='disabled' />
                <input type='hidden' name='Store_ID' id='Store_ID' value='112480' />
              </td>
            </tr>
            <tr>
              <th><label for='Store_Number'>{t[language].settingsStoresStoreNumber}: <span class='redText'>*</span></label></th>
              <td><input type='text' maxLength='100' name='Store_Number' id='Store_Number' value='' disabled='disabled' /></td>
            </tr>
            <tr>
              <th><label for='Store_AddressLine1'>{t[language].address1}:<span class='redText'>*</span></label></th>
              <td><input type='text' maxLength='100' name='Store_AddressLine1' id='Store_AddressLine1' value='' disabled='disabled' /></td>
            </tr>
            <tr>
              <th><label for='Store_AddressLine2'>{t[language].address2}:</label></th>
              <td><input type='text' maxLength='100' name='Store_AddressLine2' id='Store_AddressLine2' value='' disabled='disabled' /></td>
            </tr>
            <tr>
              <th><label for='Store_AddressLine3'>{t[language].address3}:</label></th>
              <td><input type='text' maxLength='100' name='Store_AddressLine3' id='Store_AddressLine3' value='' disabled='disabled' /></td>
            </tr>
            <tr>
              <th><label for='Store_AddressLine4'>{t[language].address4}:</label></th>
              <td><input type='text' maxLength='100' name='Store_AddressLine4' id='Store_AddressLine4' value='' disabled='disabled' /></td>
            </tr>
            <tr>
              <th><label for='Store_Locality'>{t[language].settingsStoresStoreCity}: <span class='redText'>*</span></label></th>
              <td>
                <table class='locale'>
                  <tbody>
                    <tr>
                      <td><input type='text' maxLength='100' name='Store_Locality' id='Store_Locality' value='' disabled='disabled' /></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <th><label for='Store_Region'>{t[language].region}: <span class='redText'>*</span></label></th>
              <td>
                <table class='locale'>
                  <tbody>
                    <tr>
                      <td><input type='text' maxLength='100' name='Store_Region' id='Store_Region' value='CA' disabled='disabled' /></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <th><label for='Store_PostCode'>{t[language].zip}: <span class='redText'>*</span></label></th>
              <td><input type='text' maxLength='100' name='Store_PostCode' id='Store_PostCode' value='' disabled='disabled' /></td>
            </tr>
            <tr>
              <th><label for='Store_Country'>{t[language].settingsStoresCountry}: <span class='redText'>*</span></label></th>
              <td>
                <select name='Store_Country_ID' id='Store_Country_ID' disabled='disabled'>
                  <option value='1'>United States</option>
                  <option value='40'>Canada</option>
                  <option value='2'>Afghanistan</option>
                  <option value='3'>Aland Islands</option>
                  <option value='4'>Albania</option>
                  <option value='5'>Algeria</option>
                  <option value='6'>American Samoa</option>
                  <option value='7'>Andorra</option>
                  <option value='8'>Angola</option>
                  <option value='9'>Anguilla</option>
                  <option value='10'>Antarctica</option>
                  <option value='11'>Antigua &amp; Barbuda</option>
                  <option value='12'>Argentina</option>
                  <option value='13'>Armenia</option>
                  <option value='14'>Aruba</option>
                  <option value='15'>Australia</option>
                  <option value='16'>Austria</option>
                  <option value='17'>Azerbaijan</option>
                  <option value='18'>Bahamas</option>
                  <option value='19'>Bahrain</option>
                  <option value='20'>Bangladesh</option>
                  <option value='21'>Barbados</option>
                  <option value='22'>Belarus</option>
                  <option value='23'>Belgium</option>
                  <option value='24'>Belize</option>
                  <option value='25'>Benin</option>
                  <option value='26'>Bermuda</option>
                  <option value='27'>Bhutan</option>
                  <option value='28'>Bolivia</option>
                  <option value='29'>Bosnia-Herzegovina</option>
                  <option value='30'>Botswana</option>
                  <option value='31'>Bouvet Island</option>
                  <option value='32'>Brazil</option>
                  <option value='33'>British Indian Ocean</option>
                  <option value='34'>Brunei Darussalam</option>
                  <option value='35'>Bulgaria</option>
                  <option value='36'>Burkina Faso</option>
                  <option value='37'>Burundi</option>
                  <option value='38'>Cambodia</option>
                  <option value='39'>Cameroon</option>
                  <option value='41'>Cape Verde</option>
                  <option value='42'>Cayman Islands</option>
                  <option value='43'>Central African Repu</option>
                  <option value='44'>Chad</option>
                  <option value='45'>Chile</option>
                  <option value='46'>China</option>
                  <option value='47'>Christmas Island</option>
                  <option value='48'>Cocos (Keeling) Isl</option>
                  <option value='49'>Colombia</option>
                  <option value='50'>Comoros</option>
                  <option value='51'>Congo</option>
                  <option value='52'>Congo, Republic of</option>
                  <option value='53'>Cook Islands</option>
                  <option value='54'>Costa Rica</option>
                  <option value='55'>Cote D'Ivoire</option>
                  <option value='56'>Croatia</option>
                  <option value='57'>Cuba</option>
                  <option value='58'>Cyprus</option>
                  <option value='59'>Czech Republic</option>
                  <option value='60'>Denmark</option>
                  <option value='61'>Djibouti</option>
                  <option value='62'>Dominica</option>
                  <option value='63'>Dominican Republic</option>
                  <option value='64'>East Timor</option>
                  <option value='65'>Ecuador</option>
                  <option value='66'>Egypt</option>
                  <option value='67'>El Salvador</option>
                  <option value='68'>Equatorial Guinea</option>
                  <option value='69'>Eritrea</option>
                  <option value='70'>Estonia</option>
                  <option value='71'>Ethiopia</option>
                  <option value='72'>Falkland Islands (Ma</option>
                  <option value='73'>Faroe Islands</option>
                  <option value='74'>Fiji</option>
                  <option value='75'>Finland</option>
                  <option value='76'>France</option>
                  <option value='77'>Freight Forwarder</option>
                  <option value='78'>French Guyana</option>
                  <option value='79'>French Polynesia</option>
                  <option value='80'>French Southern Terr</option>
                  <option value='81'>Gabon</option>
                  <option value='82'>Gambia</option>
                  <option value='83'>Georgia</option>
                  <option value='84'>Germany</option>
                  <option value='85'>Ghana</option>
                  <option value='86'>Gibraltar</option>
                  <option value='87'>Greece</option>
                  <option value='88'>Greenland</option>
                  <option value='89'>Grenada</option>
                  <option value='90'>Guadeloupe (French)</option>
                  <option value='91'>Guam (USA)</option>
                  <option value='92'>Guatemala</option>
                  <option value='93'>Guernsey</option>
                  <option value='94'>Guinea</option>
                  <option value='95'>Guinea Bissau</option>
                  <option value='96'>Guyana</option>
                  <option value='97'>Haiti</option>
                  <option value='98'>Heard &amp; Mcdonald Isl</option>
                  <option value='99'>Holy See (Vatican)</option>
                  <option value='100'>Honduras</option>
                  <option value='101'>Hong Kong</option>
                  <option value='102'>Hungary</option>
                  <option value='103'>Iceland</option>
                  <option value='104'>India</option>
                  <option value='105'>Indonesia</option>
                  <option value='106'>Iran</option>
                  <option value='107'>Iraq</option>
                  <option value='108'>Ireland</option>
                  <option value='109'>Isle Of Man</option>
                  <option value='110'>Israel</option>
                  <option value='111'>Italy</option>
                  <option value='112'>Jamaica</option>
                  <option value='113'>Japan</option>
                  <option value='114'>Jersey</option>
                  <option value='115'>Jordan</option>
                  <option value='116'>Kazakhstan</option>
                  <option value='117'>Kenya</option>
                  <option value='118'>Kiribati</option>
                  <option value='119'>Kuwait</option>
                  <option value='120'>Kyrgyzstan</option>
                  <option value='121'>Laos</option>
                  <option value='122'>Latvia</option>
                  <option value='123'>Lebanon</option>
                  <option value='124'>Lesotho</option>
                  <option value='125'>Liberia</option>
                  <option value='126'>Libyan Arab Jamahiri</option>
                  <option value='127'>Liechtenstein</option>
                  <option value='128'>Lithuania</option>
                  <option value='129'>Luxembourg</option>
                  <option value='130'>Macau</option>
                  <option value='131'>Macedonia</option>
                  <option value='132'>Madagascar</option>
                  <option value='133'>Malawi</option>
                  <option value='134'>Malaysia</option>
                  <option value='135'>Maldives</option>
                  <option value='136'>Mali</option>
                  <option value='137'>Malta</option>
                  <option value='138'>Marshall Islands</option>
                  <option value='139'>Martinique (French)</option>
                  <option value='140'>Mauritania</option>
                  <option value='141'>Mauritius</option>
                  <option value='142'>Mayotte</option>
                  <option value='143'>Mexico</option>
                  <option value='144'>Micronesia</option>
                  <option value='145'>Moldavia</option>
                  <option value='146'>Monaco</option>
                  <option value='147'>Mongolia</option>
                  <option value='247'>Montenegro</option>
                  <option value='148'>Montserrat</option>
                  <option value='149'>Morocco</option>
                  <option value='150'>Mozambique</option>
                  <option value='151'>Myanmar</option>
                  <option value='152'>N. Mariana Islands</option>
                  <option value='153'>Namibia</option>
                  <option value='154'>Nauru</option>
                  <option value='155'>Nepal</option>
                  <option value='156'>Netherlands</option>
                  <option value='157'>Netherlands Antilles</option>
                  <option value='158'>New Caledonia (Fr)</option>
                  <option value='159'>New Zealand</option>
                  <option value='160'>Nicaragua</option>
                  <option value='161'>Niger</option>
                  <option value='162'>Nigeria</option>
                  <option value='163'>Niue</option>
                  <option value='164'>Norfolk Island</option>
                  <option value='165'>North Korea</option>
                  <option value='166'>Norway</option>
                  <option value='167'>Oman</option>
                  <option value='168'>Pakistan</option>
                  <option value='169'>Palau</option>
                  <option value='170'>Palestinian Territor</option>
                  <option value='171'>Panama</option>
                  <option value='172'>Papua New Guinea</option>
                  <option value='173'>Paraguay</option>
                  <option value='174'>Peru</option>
                  <option value='175'>Philippines</option>
                  <option value='176'>Pitcairn Island</option>
                  <option value='177'>Poland</option>
                  <option value='178'>Portugal</option>
                  <option value='179'>Puerto Rico</option>
                  <option value='180'>Qatar</option>
                  <option value='181'>Reunion (French)</option>
                  <option value='182'>Romania</option>
                  <option value='183'>Russian Federation</option>
                  <option value='184'>Rwanda</option>
                  <option value='185'>Saint Helena</option>
                  <option value='186'>Samoa</option>
                  <option value='187'>San Marino</option>
                  <option value='188'>Sao Tome and Princip</option>
                  <option value='189'>Saudi Arabia</option>
                  <option value='190'>Senegal</option>
                  <option value='248'>Serbia</option>
                  <option value='191'>Serbia and Montenegr</option>
                  <option value='192'>Seychelles</option>
                  <option value='193'>Sierra Leone</option>
                  <option value='194'>Singapore</option>
                  <option value='195'>Slovakia</option>
                  <option value='196'>Slovenia</option>
                  <option value='197'>Solomon Islands</option>
                  <option value='198'>Somalia</option>
                  <option value='199'>South Africa</option>
                  <option value='200'>South Georgia</option>
                  <option value='201'>South Korea</option>
                  <option value='202'>Spain</option>
                  <option value='203'>Sri Lanka</option>
                  <option value='204'>St Kitts and Nevis</option>
                  <option value='205'>St Vincent &amp; Grenadi</option>
                  <option value='206'>St. Lucia</option>
                  <option value='207'>St. Pierre and Mique</option>
                  <option value='208'>Sudan</option>
                  <option value='209'>Suriname</option>
                  <option value='210'>Svalbard and Jan May</option>
                  <option value='211'>Swaziland</option>
                  <option value='212'>Sweden</option>
                  <option value='213'>Switzerland</option>
                  <option value='214'>Syria</option>
                  <option value='215'>Taiwan</option>
                  <option value='216'>Tajikistan</option>
                  <option value='217'>Tanzania</option>
                  <option value='218'>Thailand</option>
                  <option value='219'>Timor-Leste</option>
                  <option value='220'>Togo</option>
                  <option value='221'>Tokelau</option>
                  <option value='222'>Tonga</option>
                  <option value='223'>Trinidad &amp; Tobago</option>
                  <option value='224'>Tunisia</option>
                  <option value='225'>Turkey</option>
                  <option value='226'>Turkmenistan</option>
                  <option value='227'>Turks &amp; Caicos Islnd</option>
                  <option value='228'>Tuvalu</option>
                  <option value='229'>Uganda</option>
                  <option value='230'>Ukraine</option>
                  <option value='231'>United Arab Emirates</option>
                  <option value='232'>United Kingdom</option>
                  <option value='233'>Uruguay</option>
                  <option value='234'>US Minor Outlying Is</option>
                  <option value='235'>Uzbekistan</option>
                  <option value='236'>Vanuatu</option>
                  <option value='237'>Venezuela</option>
                  <option value='238'>Vietnam</option>
                  <option value='239'>Virgin Islands (UK)</option>
                  <option value='240'>Virgin Islands (USA)</option>
                  <option value='241'>Wallis &amp; Futuna Isl</option>
                  <option value='242'>Western Sahara</option>
                  <option value='243'>Yemen</option>
                  <option value='244'>Yugoslavia</option>
                  <option value='245'>Zambia</option>
                  <option value='246'>Zimbabwe</option>
                </select>
              </td>
            </tr>
            <tr>
              <th><label for='Store_TZ'>{t[language].Timezone}: <span class='redText'>*</span></label></th>
              <td>
                <select name='Store_TZ' id='Store_TZ'>
                  <option value='none'>
                    Select a Timezone
                  </option>
                  <option value='(GMT) Coordinated Universal Time'>(GMT) Coordinated Universal Time</option>
                  <option value='(GMT+00:00) Casablanca'>(GMT+00:00) Casablanca</option>
                  <option value='(GMT+00:00) Dublin, Edinburgh, Lisbon, London'>(GMT+00:00) Dublin, Edinburgh, Lisbon, London</option>
                  <option value='(GMT+00:00) Monrovia, Reykjavik'>(GMT+00:00) Monrovia, Reykjavik</option>
                  <option value='(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna'>(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
                  <option value='(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague'>(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague</option>
                  <option value='(GMT+01:00) Brussels, Copenhagen, Madrid, Paris'>(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</option>
                  <option value='(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb'>(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb</option>
                  <option value='(GMT+01:00) West Central Africa'>(GMT+01:00) West Central Africa</option>
                  <option value='(GMT+01:00) Windhoek'>(GMT+01:00) Windhoek</option>
                  <option value='(GMT+02:00) Amman'>(GMT+02:00) Amman</option>
                  <option value='(GMT+02:00) Athens, Bucharest'>(GMT+02:00) Athens, Bucharest</option>
                  <option value='(GMT+02:00) Beirut'>(GMT+02:00) Beirut</option>
                  <option value='(GMT+02:00) Cairo'>(GMT+02:00) Cairo</option>
                  <option value='(GMT+02:00) Chisinau'>(GMT+02:00) Chisinau</option>
                  <option value='(GMT+02:00) Damascus'>(GMT+02:00) Damascus</option>
                  <option value='(GMT+02:00) Gaza, Hebron'>(GMT+02:00) Gaza, Hebron</option>
                  <option value='(GMT+02:00) Harare, Pretoria'>(GMT+02:00) Harare, Pretoria</option>
                  <option value='(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius'>(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius</option>
                  <option value='(GMT+02:00) Jerusalem'>(GMT+02:00) Jerusalem</option>
                  <option value='(GMT+02:00) Kaliningrad'>(GMT+02:00) Kaliningrad</option>
                  <option value='(GMT+02:00) Tripoli'>(GMT+02:00) Tripoli</option>
                  <option value='(GMT+03:00) Baghdad'>(GMT+03:00) Baghdad</option>
                  <option value='(GMT+03:00) Istanbul'>(GMT+03:00) Istanbul</option>
                  <option value='(GMT+03:00) Kaliningrad, Minsk'>(GMT+03:00) Kaliningrad, Minsk</option>
                  <option value='(GMT+03:00) Kuwait, Riyadh'>(GMT+03:00) Kuwait, Riyadh</option>
                  <option value='(GMT+03:00) Minsk'>(GMT+03:00) Minsk</option>
                  <option value='(GMT+03:00) Moscow, St. Petersburg, Volgograd'>(GMT+03:00) Moscow, St. Petersburg, Volgograd</option>
                  <option value='(GMT+03:00) Nairobi'>(GMT+03:00) Nairobi</option>
                  <option value='(GMT+03:30) Tehran'>(GMT+03:30) Tehran</option>
                  <option value='(GMT+04:00) Abu Dhabi, Muscat'>(GMT+04:00) Abu Dhabi, Muscat</option>
                  <option value='(GMT+04:00) Baku'>(GMT+04:00) Baku</option>
                  <option value='(GMT+04:00) Izhevsk, Samara'>(GMT+04:00) Izhevsk, Samara</option>
                  <option value='(GMT+04:00) Port Louis'>(GMT+04:00) Port Louis</option>
                  <option value='(GMT+04:00) Tbilisi'>(GMT+04:00) Tbilisi</option>
                  <option value='(GMT+04:00) Yerevan'>(GMT+04:00) Yerevan</option>
                  <option value='(GMT+04:30) Kabul'>(GMT+04:30) Kabul</option>
                  <option value='(GMT+05:00) Ashgabat, Tashkent'>(GMT+05:00) Ashgabat, Tashkent</option>
                  <option value='(GMT+05:00) Ekaterinburg'>(GMT+05:00) Ekaterinburg</option>
                  <option value='(GMT+05:00) Islamabad, Karachi'>(GMT+05:00) Islamabad, Karachi</option>
                  <option value='(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi'>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                  <option value='(GMT+05:30) Sri Jayawardenepura'>(GMT+05:30) Sri Jayawardenepura</option>
                  <option value='(GMT+05:45) Kathmandu'>(GMT+05:45) Kathmandu</option>
                  <option value='(GMT+06:00) Astana'>(GMT+06:00) Astana</option>
                  <option value='(GMT+06:00) Dhaka'>(GMT+06:00) Dhaka</option>
                  <option value='(GMT+06:00) Omsk'>(GMT+06:00) Omsk</option>
                  <option value='(GMT+06:30) Yangon (Rangoon)'>(GMT+06:30) Yangon (Rangoon)</option>
                  <option value='(GMT+07:00) Bangkok, Hanoi, Jakarta'>(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                  <option value='(GMT+07:00) Hovd'>(GMT+07:00) Hovd</option>
                  <option value='(GMT+07:00) Krasnoyarsk'>(GMT+07:00) Krasnoyarsk</option>
                  <option value='(GMT+07:00) Novosibirsk'>(GMT+07:00) Novosibirsk</option>
                  <option value='(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi'>(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
                  <option value='(GMT+08:00) Irkutsk'>(GMT+08:00) Irkutsk</option>
                  <option value='(GMT+08:00) Krasnoyarsk'>(GMT+08:00) Krasnoyarsk</option>
                  <option value='(GMT+08:00) Kuala Lumpur, Singapore'>(GMT+08:00) Kuala Lumpur, Singapore</option>
                  <option value='(GMT+08:00) Perth'>(GMT+08:00) Perth</option>
                  <option value='(GMT+08:00) Taipei'>(GMT+08:00) Taipei</option>
                  <option value='(GMT+08:00) Ulaanbaatar'>(GMT+08:00) Ulaanbaatar</option>
                  <option value='(GMT+08:30) Pyongyang'>(GMT+08:30) Pyongyang</option>
                  <option value='(GMT+08:45) Eucla'>(GMT+08:45) Eucla</option>
                  <option value='(GMT+09:00) Chita'>(GMT+09:00) Chita</option>
                  <option value='(GMT+09:00) Irkutsk'>(GMT+09:00) Irkutsk</option>
                  <option value='(GMT+09:00) Osaka, Sapporo, Tokyo'>(GMT+09:00) Osaka, Sapporo, Tokyo</option>
                  <option value='(GMT+09:00) Seoul'>(GMT+09:00) Seoul</option>
                  <option value='(GMT+09:00) Yakutsk'>(GMT+09:00) Yakutsk</option>
                  <option value='(GMT+09:30) Adelaide'>(GMT+09:30) Adelaide</option>
                  <option value='(GMT+09:30) Darwin'>(GMT+09:30) Darwin</option>
                  <option value='(GMT+10:00) Brisbane'>(GMT+10:00) Brisbane</option>
                  <option value='(GMT+10:00) Canberra, Melbourne, Sydney'>(GMT+10:00) Canberra, Melbourne, Sydney</option>
                  <option value='(GMT+10:00) Guam, Port Moresby'>(GMT+10:00) Guam, Port Moresby</option>
                  <option value='(GMT+10:00) Hobart'>(GMT+10:00) Hobart</option>
                  <option value='(GMT+10:00) Vladivostok'>(GMT+10:00) Vladivostok</option>
                  <option value='(GMT+10:00) Yakutsk'>(GMT+10:00) Yakutsk</option>
                  <option value='(GMT+10:30) Lord Howe Island'>(GMT+10:30) Lord Howe Island</option>
                  <option value='(GMT+11:00) Bougainville Island'>(GMT+11:00) Bougainville Island</option>
                  <option value='(GMT+11:00) Chokurdakh'>(GMT+11:00) Chokurdakh</option>
                  <option value='(GMT+10:00) Magadan'>(GMT+10:00) Magadan</option>
                  <option value='(GMT+11:00) Norfolk Island'>(GMT+11:00) Norfolk Island</option>
                  <option value='(GMT+11:00) Sakhalin'>(GMT+11:00) Sakhalin</option>
                  <option value='(GMT+11:00) Solomon Is., New Caledonia'>(GMT+11:00) Solomon Is., New Caledonia</option>
                  <option value='(GMT+11:00) Vladivostok'>(GMT+11:00) Vladivostok</option>
                  <option value='(GMT+12:00) Anadyr, Petropavlovsk-Kamchatsky'>(GMT+12:00) Anadyr, Petropavlovsk-Kamchatsky</option>
                  <option value='(GMT+12:00) Auckland, Wellington'>(GMT+12:00) Auckland, Wellington</option>
                  <option value='(GMT+12:00) Coordinated Universal Time+12'>(GMT+12:00) Coordinated Universal Time+12</option>
                  <option value='(GMT+12:00) Fiji'>(GMT+12:00) Fiji</option>
                  <option value='(GMT+12:45) Chatham Islands'>(GMT+12:45) Chatham Islands</option>
                  <option value="(GMT+13:00) Nuku'alofa">(GMT+13:00) Nuku'alofa</option>
                  <option value='(GMT+13:00) Samoa'>(GMT+13:00) Samoa</option>
                  <option value='(GMT+14:00) Kiritimati Island'>(GMT+14:00) Kiritimati Island</option>
                  <option value='(GMT-01:00) Azores'>(GMT-01:00) Azores</option>
                  <option value='(GMT-01:00) Cabo Verde Is.'>(GMT-01:00) Cabo Verde Is.</option>
                  <option value='(GMT-02:00) Coordinated Universal Time-02'>(GMT-02:00) Coordinated Universal Time-02</option>
                  <option value='(GMT-02:00) Mid-Atlantic'>(GMT-02:00) Mid-Atlantic</option>
                  <option value='(GMT-03:00) Araguaina'>(GMT-03:00) Araguaina</option>
                  <option value='(GMT-03:00) Brasilia'>(GMT-03:00) Brasilia</option>
                  <option value='(GMT-03:00) Cayenne, Fortaleza'>(GMT-03:00) Cayenne, Fortaleza</option>
                  <option value='(GMT-03:00) City of Buenos Aires'>(GMT-03:00) City of Buenos Aires</option>
                  <option value='(GMT-03:00) Greenland'>(GMT-03:00) Greenland</option>
                  <option value='(GMT-03:00) Montevideo'>(GMT-03:00) Montevideo</option>
                  <option value='(GMT-03:00) Saint Pierre and Miquelon'>(GMT-03:00) Saint Pierre and Miquelon</option>
                  <option value='(GMT-03:00) Salvador'>(GMT-03:00) Salvador</option>
                  <option value='(GMT-03:30) Newfoundland'>(GMT-03:30) Newfoundland</option>
                  <option value='(GMT-04:00) Asuncion'>(GMT-04:00) Asuncion</option>
                  <option value='(GMT-04:00) Atlantic Time (Canada)'>(GMT-04:00) Atlantic Time (Canada)</option>
                  <option value='(GMT-04:00) Cuiaba'>(GMT-04:00) Cuiaba</option>
                  <option value='(GMT-04:00) Georgetown, La Paz, Manaus, San Juan'>(GMT-04:00) Georgetown, La Paz, Manaus, San Juan</option>
                  <option value='(GMT-04:00) Santiago'>(GMT-04:00) Santiago</option>
                  <option value='(GMT-04:00) Turks and Caicos'>(GMT-04:00) Turks and Caicos</option>
                  <option value='(GMT-04:30) Caracas'>(GMT-04:30) Caracas</option>
                  <option value='(GMT-05:00) Bogota, Lima, Quito, Rio Branco'>(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option>
                  <option value='(GMT-05:00) Chetumal'>(GMT-05:00) Chetumal</option>
                  <option value='(GMT-05:00) Eastern Time (US &amp; Canada)'>(GMT-05:00) Eastern Time (US &amp; Canada)</option>
                  <option value='(GMT-05:00) Haiti'>(GMT-05:00) Haiti</option>
                  <option value='(GMT-05:00) Havana'>(GMT-05:00) Havana</option>
                  <option value='(GMT-05:00) Indiana (East)'>(GMT-05:00) Indiana (East)</option>
                  <option value='(GMT-06:00) Central America'>(GMT-06:00) Central America</option>
                  <option value='(GMT-06:00) Central Time (US &amp; Canada)'>(GMT-06:00) Central Time (US &amp; Canada)</option>
                  <option value='(GMT-06:00) Easter Island'>(GMT-06:00) Easter Island</option>
                  <option value='(GMT-06:00) Guadalajara, Mexico City, Monterrey'>(GMT-06:00) Guadalajara, Mexico City, Monterrey</option>
                  <option value='(GMT-06:00) Saskatchewan'>(GMT-06:00) Saskatchewan</option>
                  <option value='(GMT-07:00) Arizona'>(GMT-07:00) Arizona</option>
                  <option value='(GMT-07:00) Chihuahua, La Paz, Mazatlan'>(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
                  <option value='(GMT-07:00) Mountain Time (US &amp; Canada)'>(GMT-07:00) Mountain Time (US &amp; Canada)</option>
                  <option value='(GMT-08:00) Baja California'>(GMT-08:00) Baja California</option>
                  <option value='(GMT-08:00) Coordinated Universal Time-08'>(GMT-08:00) Coordinated Universal Time-08</option>
                  <option value='(GMT-08:00) Pacific Time (US &amp; Canada)'>(GMT-08:00) Pacific Time (US &amp; Canada)</option>
                  <option value='(GMT-09:00) Alaska'>(GMT-09:00) Alaska</option>
                  <option value='(GMT-09:00) Coordinated Universal Time-09'>(GMT-09:00) Coordinated Universal Time-09</option>
                  <option value='(GMT-09:30) Marquesas Islands'>(GMT-09:30) Marquesas Islands</option>
                  <option value='(GMT-10:00) Aleutian Islands'>(GMT-10:00) Aleutian Islands</option>
                  <option value='(GMT-10:00) Hawaii'>(GMT-10:00) Hawaii</option>
                  <option value='(GMT-11:00) Coordinated Universal Time-11'>(GMT-11:00) Coordinated Universal Time-11</option>
                  <option value='(GMT-12:00) International Date Line West'>(GMT-12:00) International Date Line West</option>
                  <option value='(GMT+06:00) Novosibirsk'>(GMT+06:00) Novosibirsk</option>
                  <option value='(GMT+04:00) Astrakhan, Ulyanovsk'>(GMT+04:00) Astrakhan, Ulyanovsk</option>
                  <option value='(GMT+07:00) Barnaul, Gorno-Altaysk'>(GMT+07:00) Barnaul, Gorno-Altaysk</option>
                  <option value='(GMT+07:00) Tomsk'>(GMT+07:00) Tomsk</option>
                </select>
              </td>
            </tr>
            <tr>
              <th><label for='Store_PhoneNumber'>{t[language].phone}: <span class='redText'>*</span></label></th>
              <td><input type='text' maxLength='100' name='Store_PhoneNumber' id='Store_PhoneNumber' value='' disabled='disabled' /></td>
            </tr>
            <tr>
              <th><label for='Store_FaxNumber'>{t[language].settingsStoresFax}:</label></th>
              <td><input type='text' maxLength='100' name='Store_FaxNumber' id='Store_FaxNumber' value='' disabled='disabled' /></td>
            </tr>
            <tr />
          </tbody>
        </table>
        {this.storeTabs()}
        <StoreMerge show={this.state.show} onHide={() => this.setState({ show: false })} data={this.props.storesDetails.storePopupDetails} />
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    storesDetails: state.StorePopupDetails,
    storeModelPopup: state.StorePopupDetails.storePopUpClient,
    storeModelPopupIsAdmin: state.StorePopupDetails.storePopUpDetailisAdmin
  }
}
export default connect(mapStateToProps)(StoreDetailsComponent)
