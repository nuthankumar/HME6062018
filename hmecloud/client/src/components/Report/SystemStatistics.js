import React, { Component } from 'react'
import moment from 'moment'
import './SummaryReport.css'

class SystemStatistics extends Component {
  constructor (props) {
    super(props)
    this.state = {
      displayData: {
        Lane: '1',
        AverageCarsInLane: '3',
        TotalPullouts: '0',
        TotalPullins: '0',
        DeleteOverMaximum: '0',
        PowerFails: '0',
        SystemResets: '0',
        VBDResets: '0'
    }
    }
   // this.displayRecords = this.displayRecords.bind(this)
  }

 
  render () {
    return (
      <div>
          <div className="systemSec" id='page-container'>
				<h2 className="rep_head"><span translate="" key="systemstats">System Statistics</span></h2>
				<table cellspacing="0" className="table-layout-System ssBord colWidthSS5">
					<tbody><tr>
						<th className="lane1" colspan="2"><span translate="" key="ReportsLane">Lane</span> {this.state.displayData.Lane}</th>
					</tr>
					<tr>
						<td id="sscolwidth" className="rnshade"><span translate="" key="ReportsAverageCarsInLane">Average Cars in Lane</span></td>
						<td id="sscolwidthSM" className="rnshade"><strong>{this.state.displayData.AverageCarsInLane}</strong></td>
					</tr>
					<tr>
						<td id="sscolwidth" className="rshade"><span translate="" key="ReportsTotalPullouts">Total Pullouts</span></td>
						<td className="rshade">{this.state.displayData.TotalPullouts}</td>
					</tr>
					<tr>
						<td id="sscolwidth" className="rnshade"><span translate="" key="ReportsTotalPullins">Total Pullins</span></td>
						<td className="rnshade">{this.state.displayData.TotalPullins}</td>
					</tr>
					<tr>
						<td id="sscolwidth" className="rshade"><span translate="" key="ReportsDeleteOverMax">Delete Over Maximum</span></td>
						<td className="rshade">{this.state.displayData.DeleteOverMaximum}</td>
					</tr>
					<tr>
						<td id="sscolwidth" className="rnshade"><span translate="" key="ReportsPowerFails">Power Fails</span></td>
						<td className="rnshade">{this.state.displayData.PowerFails}</td>
					</tr>
					<tr>
						<td id="sscolwidth" className="rshade"><span translate="" key="ReportsSystemResets">System Resets</span></td>
						<td className="rshade">{this.state.displayData.SystemResets}</td>
					</tr>
					<tr>
						<td id="sscolwidth" className="rnshade"><span translate="" key="ReportsVBDResets">VBD Resets</span></td>
						<td className="rnshade">{this.state.displayData.VBDResets}</td>
					</tr>
				</tbody>
                </table>
			</div>
      </div>
    )
  }
}

export default SystemStatistics












