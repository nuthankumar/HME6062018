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
          <table className='goalstatistics-table'>
            <tbody>
              <tr>
                <th className='blankHeader'/>
                <th className='tableHeading' colSpan='4'>
                  <span>AVERAGE TIME</span><span>(min:sec)</span>
                </th>
              </tr>
              <tr>
                <th className='reportTableAttributesHeading'><span></span></th>
                <th className='reportTableAttributesHeading'><span>Menu</span></th>
                <th className='reportTableAttributesHeading'><span>Greet</span></th>
                <th className='reportTableAttributesHeading'><span>Service</span></th>
                <th className='reportTableAttributesHeading'><span>Lane Queue</span></th>
                <th className='reportTableAttributesHeading'><span>Lane Total</span></th>
              </tr>
              {this.displayGoalStatisticsRowData(goalData.data)}
            </tbody>
          </table>
          </div>
        </div>)
  }

  displayGoalStatisticsRowData (goalRowData) {
    if (goalRowData.length > 0) {
      return goalRowData.map((goalItem) => {
        return (
          <tr>
            <td>{goalItem.title}</td>
            <td>{goalItem.menu}</td>
            <td>{goalItem.greet}</td>
            <td>{goalItem.service}</td>
            <td>{goalItem.laneQueue}</td>
            <td>{goalItem.laneTotal}</td>
          </tr>
        )
      })
    } else {
      return <div>No records found</div>
    }
  }

  render () {
    let goalData = this.props.goalData

    return (<div>{this.displayGoalStatisticsData(goalData)}</div>)
  }
}
