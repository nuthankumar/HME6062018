import React, { Component } from 'react'
import './SummaryReport.css'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

class LongestTime extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage(),
        }
    }

    render() {
        const language = this.state.currentLanguage
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
    }





    renderLongestTimes() {
        let renderStores;
        let LongestTimes = this.props.LongestTimes;
        let renderLongestTimes = LongestTimes.map(function (LongestTimes, index) {
          return (<tr>
                    <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{LongestTimes.Menu.Value}</span><br /><span className="longtime-timeSpan">{LongestTimes.Menu.Date}<br />{LongestTimes.Menu.Time}</span></td>
                    <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{LongestTimes.Greet.Value}</span><br /><span className="longtime-timeSpan">{LongestTimes.Greet.Date}<br />{LongestTimes.Greet.Time}</span></td>
                    <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{LongestTimes.Service.Value}</span><br /><span className="longtime-timeSpan">{LongestTimes.Service.Date}<br />{LongestTimes.Service.Time}</span></td>
                    <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{LongestTimes.LaneQueue.Value}</span><br /><span className="longtime-timeSpan">{LongestTimes.LaneQueue.Date}<br />{LongestTimes.LaneQueue.Time}</span></td>
                    <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{LongestTimes.LaneTotal.Value}</span><br /><span className="longtime-timeSpan">{LongestTimes.LaneTotal.Date}<br />{LongestTimes.LaneTotal.Time}</span></td>
                    <td className='lastTd'></td>
 				          </tr>);
        });
        return renderLongestTimes;
    }


}

export default LongestTime
