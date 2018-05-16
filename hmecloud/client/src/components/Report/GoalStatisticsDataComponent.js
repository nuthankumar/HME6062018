import React, { Component } from 'react'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './SummaryReport.css'
import '../../../node_modules/font-awesome/css/font-awesome.min.css'

import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

export default class GoalStatisticsDataComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage(),
      goalStatisticsType: '',
      eventList: [
        "Menu Board",
        "Greet",
        "Service",
        "Lane Queue",
        "Lane Total",
        "totalCars"
      ]
    }
    this.displayGoalStatisticsData = this.displayGoalStatisticsData.bind(this)
    this.displayGoalStatisticsRowData = this.displayGoalStatisticsRowData.bind(this)
    this.goalStatisticsTableHeader = this.goalStatisticsTableHeader.bind(this)
  }

  componentWillMount() {
    this.state.goalStatisticsType = this.getTimeMeasureType(this.props.reportData.drillDownRequestData.timeMeasure)
    this.setState(this.state)
  }

  displayGoalStatisticsData(goalData) {
    const language = this.state.currentLanguage
    return (<div>
      <div className='goalstatistics-header-text'>{t[language].ReportsGoalsStatsFor + ' ' + this.state.goalStatisticsType}</div>
      <div className='goalstatistics-data-unit'>
        <table className='goalstatistics-table goalstatistics-table-header'>
          <div className='goalStatistics-cover'></div>
          <tbody>
            <tr>
              <th className='blankHeader' />
              <th className='tableHeading' colSpan={(this.props.reportData.groupStoreColumns? this.props.reportData.response.eventList.length - 4 : this.props.reportData.response.eventList.length - 3)}>
                <span>{t[language].ReportsAveragePerformancePerEvent}</span><span>(min:sec)</span>
              </th>
            </tr>
            <tr className='goalstatistics-row-heading'>
              {this.goalStatisticsTableHeader}
            </tr>
            {/* <tr className='goalstatistics-row-heading'>
                <th className='reportTableAttributesHeading blank-heading'><span></span></th>
                <th className='reportTableAttributesHeading'><span>{t[language].MenuBoard}</span></th>
                <th className='reportTableAttributesHeading'><span>{t[language].Greet}</span></th>
                <th className='reportTableAttributesHeading'><span>{t[language].Service}</span></th>
                <th className='reportTableAttributesHeading'><span>{t[language].LaneQueue}</span></th>
                <th className='reportTableAttributesHeading'><span>{t[language].LaneTotal}</span></th>
              </tr> */}
            <tr>
              <th className='reportTableAttributesHeading blank-heading' />
              {this.goalStatisticsTableHeader()}
            </tr>
          </tbody>
        </table>
      </div>
      <div className=''>
        {this.displayGoalStatisticsRowData(goalData)}
      </div>
      <div className={'goalNote ' + (this.props.reportData.singleStore ? 'show' : '')}> <span className="redFont">* </span>{t[language].ReportsDerivedPerformancetoGoal} </div>
    </div>)
  }

  goalStatisticsTableHeader() {
    let colWidth = this.props.reportData.response.eventList.length
    return this.props.reportData.response.eventList.map((headerItem) => {
      return (
        // <th className={(headerItem === 'Groups' ? 'groupsColHeader' : '') + (headerItem == 'Store_Name' ? 'storesColHeader' : '') + (headerItem === 'Store_Name' || headerItem === 'Groups' || headerItem === 'week' || headerItem === 'day' || headerItem === 'daypart' ? 'reporttable-attributes-heading-dynamic'+colWidth : 'reportTableAttributesHeading')}><span>{headerItem}</span></th>
        <th className={(headerItem === 'Groups' || headerItem === 'Stores' || headerItem === 'Week' || headerItem === 'Day' || headerItem === 'Daypart' || headerItem === 'Total Cars' ? 'hide-table-cell ' : 'show-table-cell ') + ('reportTableAttributesHeading' + colWidth)}>
          <span>{headerItem}</span>
        </th>
      )

    })
  }

  displayGoalStatisticsRowData(goalRowData) {
    if (goalRowData) {
      return goalRowData.map((goalItem) => {
        let color = '#ffffff'
        return (<table className='goalstatistics-table goalstatistics-table-content'>
          <tbody>
            {this.getStatisticsRow(goalItem, "goal", goalItem.title, goalItem.color, color)}
            {this.getStatisticsRow(goalItem, "cars", "Cars")}
            {this.getStatisticsRow(goalItem, "percentage", "%")}
          </tbody>
        </table>)
      })
    } else {
      return <div>No records found</div>
    }
  }

  getStatisticsRow(goalItem, type, title, color, fontcolor) {
    var Style = {
      backgroundColor: color,
      color: fontcolor
    };
    return (
      <tr style={Style}>
        <td className='goalstats-title'>{title}</td>
        {this.props.reportData.response.eventList.map(eventHeader => {
          if (eventHeader !== 'Day' && eventHeader !== 'Daypart' && eventHeader !== 'Week' &&
            eventHeader !== 'Groups' && eventHeader !== 'Stores' && eventHeader !== 'Total Cars') {
            //this.goalStatsTableCell(goalItem, type, title, eventHeader)
            return (<td className={'reportTableAttributesHeading'+this.props.reportData.response.eventList.length}>{goalItem[eventHeader][type]}</td>)
          }
        })
        }
      </tr>)

    // return this.props.reportData.response.eventList.map((eventHeader) => {
    //   if (eventHeader !== 'Day' && eventHeader !== 'Daypart' && eventHeader !== 'Week' &&
    //     eventHeader !== 'Groups' && eventHeader !== 'Stores' && eventHeader !== 'Total Cars') {
    //     return (
    //       <tr style={Style}>
    //         <td>{title}</td>
    //         {this.goalStatsTableCell(goalItem, type, title, eventHeader)}
    //       </tr>)
    //   }

    // })
  }

  goalStatsTableCell(goalItem, type, title, eventHeader) {
    return (
      <td className={'reportTableAttributesHeading'+this.props.reportData.response.eventList.length}>{goalItem[eventHeader][type]}</td>
    )
  }

  getTimeMeasureType(timeMeasureType) {
    switch (timeMeasureType.toString()) {
      case '1': return 'DAY'
        break;
      case '2': return 'DAYPART'
        break
      case '3': return 'WEEK'
        break
    }
  }

  render() {
    let goalData = this.props.goalData
    return (<div>{this.displayGoalStatisticsData(goalData)}</div>)
  }
}
