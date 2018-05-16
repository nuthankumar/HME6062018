import React, { Component } from 'react'
import './SummaryReport.css'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

class LongestTime extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage(),
            LongestTimes: [ {
              "Menu Board": {
                  "Value": 29,
                  "Date": "Mar 03/24",
                  "Time": "08:55:43 AM"
                },
              "Greet": {
                  "Value": 29,
                  "Date": "Mar 03/24",
                  "Time": "08:55:43 AM"
                },
              "Service": {
                  "Value": 29,
                  "Date": "Mar 03/24",
                  "Time": "08:55:48 AM"
                },
               
              "Lane Queue": {
                  "Value": 29,
                  "Date": "Mar 03/24",
                  "Time": "08:56:04 AM"
                },
              "Lane Total": {
                  "Value": 74,
                  "Date": "Mar 03/24",
                  "Time": "08:55:35 AM"
                }
            },{
              "Menu Board": {
                "Value": 29,
                "Date": "Mar 03/24",
                "Time": "08:55:43 AM"
              },
            "Greet": {
                "Value": 29,
                "Date": "Mar 03/24",
                "Time": "08:55:43 AM"
              },
            "Service": {
                "Value": 29,
                "Date": "Mar 03/24",
                "Time": "08:55:48 AM"
              },
             
            "Lane Queue": {
                "Value": 29,
                "Date": "Mar 03/24",
                "Time": "08:56:04 AM"
              },
            "Lane Total": {
                "Value": 74,
                "Date": "Mar 03/24",
                "Time": "08:55:35 AM"
              }
            }],
            "eventList": [
              "Menu Board",
              "Greet",
              "Service",
              "Lane Queue",
              "Lane Total",
            ]
        }
    }

    render() {
        const language = this.state.currentLanguage
        if(this.props.LongestTimes.length > 0){
          return (<section>
            <table cellSpacing="0" className="table-layout daypart longest">
              <tbody>
                <tr>
                  <td rowSpan="4" className='rshade boldin longTimes headerColumn'>
                      <span>{t[language].ReportsLongest}</span><br /><span>{t[language].ReportsTimes}</span><br/>
                    <span className="longtime-timeSpan">(min)</span>
                  </td>
                </tr>
                {this.renderLongestTimes()}
              </tbody>
            </table>
            </section>)
        }else{
          return <div/>
        }
        
    }

    renderLongestTimes() {
         let LongestTimes = this.props.LongestTimes;
        // let LongestTimes = this.state.LongestTimes   
         return LongestTimes.map((LongestTime, index) => {
                    /* <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{(LongestTimes.Menu ? LongestTimes.Menu.Value : 'N/A' )}</span><br /><span className="longtime-timeSpan">{(LongestTimes.Menu ? LongestTimes.Menu.Date : 'N/A')}<br />{(LongestTimes.Menu ? LongestTimes.Menu.Time : 'N/A')}</span></td>
                    <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{(LongestTimes.Greet ? LongestTimes.Greet.Value : 'N/A')}</span><br /><span className="longtime-timeSpan">{(LongestTimes.Greet ? LongestTimes.Greet.Date : 'N/A')}<br />{(LongestTimes.Greet ? LongestTimes.Menu.Time : 'N/A')}</span></td>
                    <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{(LongestTimes.Service ? LongestTimes.Service.Value : 'N/A')}</span><br /><span className="longtime-timeSpan">{(LongestTimes.Service ? LongestTimes.Service.Date : 'N/A')}<br />{(LongestTimes.Service ? LongestTimes.Service.Time : 'N/A')}</span></td>
                    <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{(LongestTimes.LaneQueue ? LongestTimes.LaneQueue.Value : 'N/A')}</span><br /><span className="longtime-timeSpan">{(LongestTimes.LaneQueue ? LongestTimes.LaneQueue.Date : 'N/A')}<br />{(LongestTimes.LaneQueue ? LongestTimes.LaneQueue.Time : 'N/A')}</span></td>
                    <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{(LongestTimes.LaneTotal ?  LongestTimes.LaneTotal.Value : 'N/A')}</span><br /><span className="longtime-timeSpan">{(LongestTimes.LaneTotal ? LongestTimes.LaneTotal.Date : 'N/A')}<br />{(LongestTimes.LaneTotal ? LongestTimes.LaneTotal.Time : 'N/A')}</span></td>
                    <td className='lastTd'></td> */
               return(
                <tr>
                  {this.renderLongestTimesCell(LongestTime,index)}
                  <td className='lastTd'></td>
                </tr>
               )   
          
        });
     //   return renderLongestTimes;
    }

    renderLongestTimesCell(LongestTimes,index) {
      let headerEvents = this.props.reportData.eventList
      // let headerEvents = this.state.eventList
      let colWidth = this.props.reportData.groupStoreColumns ? headerEvents.length - 3 : headerEvents.length -2
     return  headerEvents.map((headerItem) => {
       if(headerItem !== 'Day' && headerItem !== 'Daypart' && headerItem !== 'Week' &&
       headerItem !== 'Groups' && headerItem !== 'Stores' && headerItem !== 'Total Cars'){
        return(
          <td className={'reportTableAttributesHeading'+colWidth+' ' + (index % 2 === 0 ? "rshade " : "rnshade ")}><span className="boldin">{(LongestTimes[headerItem] !== undefined ? LongestTimes[headerItem].Value : 'N/A' )}</span><br /><span className="longtime-timeSpan">{(LongestTimes[headerItem] !== undefined ? LongestTimes[headerItem].Date : 'N/A')}<br />{(LongestTimes[headerItem] !== undefined ? LongestTimes[headerItem].Time : 'N/A')}</span></td>
       )
       } 
      })
      
    }


}

export default LongestTime
