import React from 'react'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

export default class CheckBoxList extends React.Component {
  constructor(props){
    super()
    this.state={
      currentLanguage: languageSettings.getCurrentLanguage(),
    }
  }
  render () {
    const language = this.state.currentLanguage
    return (
      <div className='col-xs-4'>{this.props.title} :
        <div className='select-all-groups alignCenter'>
                <input type='checkbox' onChange={(event) => this.props.selectAll(event, this.props.items)}
                    name='selectAll' /> <span className="textPaddingSmall">{t[language].selectall}</span></div>
        <div className='col-xs-12 new-groups'>
          <ul className='unlinked-grouplist'>
            {
              this.props.items.map(item =>
                <li className='' key={item.Id}>
                  <label><input type='checkbox' name='availableItem' checked={item.selected} onChange={(e) => this.props.toggle(item)} />
                  </label> {item.Type === 'group' ? item.GroupName : item.GroupName ? item.Store_Number + '-' + item.GroupName :  item.Store_Number  } </li>)
            }
          </ul>
        </div>
      </div>)
  }
}
