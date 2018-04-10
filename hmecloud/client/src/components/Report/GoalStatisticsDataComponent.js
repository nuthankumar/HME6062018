import React, { Component } from 'react'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './SummaryReport.css'
import '../../../node_modules/font-awesome/css/font-awesome.min.css'

export default class GoalStatisticsDataComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.displayGoalStatisticsData = this.displayGoalStatisticsData.bind(this)
    this.displayGoalStatisticsRowData = this.displayGoalStatisticsRowData.bind(this)
  }

  displayGoalStatisticsData (goalData) {
    return (<div>
        <div className='col-xs-12 goalstatistics-header-text'>Goal Statistics For Daypart</div>
        <div className='col-xs-12 goalstatistics-data-unit'>
          <table className='goalstatistics-table goalstatistics-table-header'>
            <tbody>
              <tr>
                <th className='blankHeader'/>
                <th className='tableHeading' colSpan='4'>
                  <span>AVERAGE TIME</span><span>(min:sec)</span>
                </th>
              </tr>
              <tr className='goalstatistics-row-heading'>
                <th className='reportTableAttributesHeading blank-heading'><span></span></th>
                <th className='reportTableAttributesHeading'><span>Menu</span></th>
                <th className='reportTableAttributesHeading'><span>Greet</span></th>
                <th className='reportTableAttributesHeading'><span>Service</span></th>
                <th className='reportTableAttributesHeading'><span>Lane Queue</span></th>
                <th className='reportTableAttributesHeading'><span>Lane Total</span></th>
              </tr>
            </tbody>
          </table>
          </div>
          <div className='col-xs-12'>
            {this.displayGoalStatisticsRowData(goalData.data)}
          </div>
        </div>)
  }

  displayGoalStatisticsRowData (goalRowData) {
    if (goalRowData.length > 0) {
      return goalRowData.map((goalItem) => {
        /*return (<table className='goalstatistics-table'>
        <tbody>
        {this.getStatisticsRow(goalItem,"goal",goalItem.title)}
        {this.getStatisticsRow(goalItem,"cars","Cars")}
        {this.getStatisticsRow(goalItem,"percentage","%")}
        </tbody>
        </table>
        )
      }) */

      return (
            <table className='goalstatistics-table goalstatistics-table-content'>
              <tbody>
                  {this.getStatisticsRow(goalItem,"goal",goalItem.title)}
                  {this.getStatisticsRow(goalItem,"cars","Cars")}
                  {this.getStatisticsRow(goalItem,"percentage","%")}
              </tbody>
            </table>
      )
    })
    } else {
      return <div>No records found</div>
    }
  }

  getStatisticsRow(goalItem,type,title){
     return <tr>
        <td>{title}</td>
        <td>{goalItem.menu[type]}</td>
        <td>{goalItem.greet[type]}</td>
        <td>{goalItem.service[type]}</td>
        <td>{goalItem.laneQueue[type]}</td>
        <td>{goalItem.laneTotal[type]}</td>
      </tr>
  }

  render () {
    let goalData = this.props.goalData
    return (<div>{this.displayGoalStatisticsData(goalData)}</div>)
  }
}
