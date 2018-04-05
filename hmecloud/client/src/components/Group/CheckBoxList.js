import React from 'react'

export default class CheckBoxList extends React.Component {
  constructor () {
    super()
  }
  render () {
    let items = this.props.items

    return (
      <div className='col-xs-4'>{this.props.title}
        <div className='select-all-groups'>
          <input type='checkbox' onChange={(event) => this.props.selectAll(event, this.props.items)}
            name='selectAll' />Select All</div>
        <div className='col-xs-12 new-groups'>
          <ul className='unlinked-grouplist'>
            {
              this.props.items.map(item =>
                <li className='' key={item.Id}>
                  <label><input type='checkbox' name='availableItem' checked={item.selected} onChange={(e) => this.props.toggle(item)} />
                  </label> {item.GroupName} </li>)
            }
          </ul>
        </div>
      </div>)
  }
}
