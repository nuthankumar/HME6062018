import React, { Component } from 'react'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './SummaryReport.css'
import '../../../node_modules/font-awesome/css/font-awesome.min.css'

export default class GoalStatisticsDataComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
        goalData: {
            data:
            [
                {
                    title: "<Goal A",
                    menu: { goal: "1", cars: "1", percentage: "1" },
                    greet: { goal: "2", cars: "1", percentage: "1" },
                    service: { goal: "3", cars: "1", percentage: "1" },
                    laneQueue: { goal: "4", cars: "1", percentage: "1" },
                    laneTotal: { goal: "5", cars: "1", percentage: "1" }
                },
                {
                    title: "<Goal B",
                    menu: { goal: "6", cars: "1", percentage: "1" },
                    greet: { goal: "7", cars: "1", percentage: "1" },
                    service: { goal: "8", cars: "1", percentage: "1" },
                    laneQueue: { goal: "9", cars: "1", percentage: "1" },
                    laneTotal: { goal: "10", cars: "1", percentage: "1" }
                },
                {
                    title: "<Goal C",
                    menu: { goal: "11", cars: "1", percentage: "1" },
                    greet: { goal: "12", cars: "1", percentage: "1" },
                    service: { goal: "13", cars: "1", percentage: "1" },
                    laneQueue: { goal: "14", cars: "1", percentage: "1" },
                    laneTotal: { goal: "15", cars: "1", percentage: "1" }
                },
            ]
        }
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

  displayGoalStatisticsRowData(goalRowData) {
      //console.log(JSON.stringify(this.props.goalData));
      //let goalRowData = this.state.goalData;
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
      console.log(JSON.stringify(goalData));
             return (<div>{this.displayGoalStatisticsData(goalData)}</div>)
  }
}
