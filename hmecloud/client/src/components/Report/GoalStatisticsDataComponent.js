import React, { Component } from 'react'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './SummaryReport.css'
import '../../../node_modules/font-awesome/css/font-awesome.min.css'

import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

export default class GoalStatisticsDataComponent extends Component {
  constructor (props) {
      super(props)
      this.state = {
          currentLanguage: languageSettings.getCurrentLanguage(),
      }
    this.displayGoalStatisticsData = this.displayGoalStatisticsData.bind(this)
    this.displayGoalStatisticsRowData = this.displayGoalStatisticsRowData.bind(this)
  }

  displayGoalStatisticsData(goalData) {
      const language = this.state.currentLanguage
    return (<div>
        <div className='col-xs-12 goalstatistics-header-text'>{t[language].ReportsGoalsStatsFor}</div>
        <div className='col-xs-12 goalstatistics-data-unit'>
          <table className='goalstatistics-table goalstatistics-table-header'>
            <tbody>
              <tr>
                <th className='blankHeader'/>
                <th className='tableHeading' colSpan='4'>
                            <span>{t[language].ReportsAveragePerformancePerEvent}</span><span>(min:sec)</span>
                </th>
              </tr>
              <tr className='goalstatistics-row-heading'>
                <th className='reportTableAttributesHeading blank-heading'><span></span></th>
                <th className='reportTableAttributesHeading'><span>{t[language].MenuBoard}</span></th>
                <th className='reportTableAttributesHeading'><span>{t[language].Greet}</span></th>
                <th className='reportTableAttributesHeading'><span>{t[language].Service}</span></th>
                <th className='reportTableAttributesHeading'><span>{t[language].LaneQueue}</span></th>
                <th className='reportTableAttributesHeading'><span>{t[language].LaneTotal}</span></th>
              </tr>
            </tbody>
          </table>
          </div>
          <div className='col-xs-12'>
            {this.displayGoalStatisticsRowData(goalData)}
          </div>
          <div className="goalNote"> <span className="redFont">* </span>{t[language].ReportsDerivedPerformancetoGoal} </div>
        </div>)
  }

  displayGoalStatisticsRowData(goalRowData) {
      console.log(JSON.stringify(this.props.goalData));
      //let goalRowData = this.state.goalData;
      if (goalRowData) {
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
              {this.getStatisticsRow(goalItem, "goal", goalItem.title, goalItem.color)}
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

getStatisticsRow(goalItem,type,title,color){
  var Style = {
      backgroundColor: color
  };
  return <tr style={Style}>
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
