import React, { Component } from 'react'
import './SummaryReport.css'

class LongestTime extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            LongestTimes: [
            {
                "Menu": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                },
                "Greet": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                },
                "Service": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                },
                "LaneQueue": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                },
                "LaneTotal": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                }
            },
            {
                "Menu": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                },
                "Greet": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                },
                "Service": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                },
                "LaneQueue": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                },
                "LaneTotal": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                }
            },
            {
                "Menu": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                },
                "Greet": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                },
                "Service": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                },
                "LaneQueue": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                },
                "LaneTotal": {
                    "Value": 0.59,
                    "Date": "Mar 03/05",
                    "Time": "07:53:22 PM"
                }
            }
            ]

        }
 
    }

    render() {
        let Longes = this.props.LongestTimes
        console.log(this.props.displayData)
        return (
            <section>

                <table cellspacing="0" class="table-layout daypart longest">
                    <tbody>
                        <tr>
                            <td rowspan="4" className='rshade boldin longTimes headerColumn'>
                                    <span translate="" key="ReportsLongest">Longest</span><br/><span translate="" key="ReportsTimes">Times</span><br/>
                                        <span class="timeSpan">(min)</span>
                                </td>
					        </tr>

                {this.renderLongestTimes()}

                   </tbody>
                  </table>
                </section>
        )
    }





    renderLongestTimes() {
        let renderStores;
        let LongestTimes = this.state.LongestTimes;
        let renderLongestTimes = LongestTimes.map(function (LongestTimes, index) {
            return (
        			
                <tr>

                    <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{LongestTimes.Menu.Value}</span><br /><span className="timeSpan">{LongestTimes.Menu.Date}<br />{LongestTimes.Menu.Time}</span></td>
                    <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{LongestTimes.Greet.Value}</span><br /><span className="timeSpan">{LongestTimes.Greet.Date}<br />{LongestTimes.Greet.Time}</span></td>
                    <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{LongestTimes.Service.Value}</span><br /><span className="timeSpan">{LongestTimes.Service.Date}<br />{LongestTimes.Service.Time}</span></td>
                    <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{LongestTimes.LaneQueue.Value}</span><br /><span className="timeSpan">{LongestTimes.LaneQueue.Date}<br />{LongestTimes.LaneQueue.Time}</span></td>
                    <td className={"colWidth5 " + (index % 2 === 0 ? "rshade" : "rnshade")}><span className="boldin">{LongestTimes.LaneTotal.Value}</span><br /><span className="timeSpan">{LongestTimes.LaneTotal.Date}<br />{LongestTimes.LaneTotal.Time}</span></td>
                    <td className='lastTd'></td>
   				</tr>
            );
        });
        return renderLongestTimes;
    }


}

export default LongestTime
