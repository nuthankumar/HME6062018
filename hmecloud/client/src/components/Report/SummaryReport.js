import React, { Component } from 'react';
import App from '../../App'
import SuccessAlert from "../Alerts/SuccessAlert"
import ErrorAlert from "../Alerts/ErrorAlert"
import fetch from 'isomorphic-fetch'
import HmeHeader from '../Header/HmeHeader'
import { BrowserRouter as Router, Route , Link  } from 'react-router-dom'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './SummaryReport.css'


const hmeLogo = require('../../images/HMELogo.png')
const zoomLogo = require('../../images/ZoomLogo.PNG')
var body = require('body-parser');
var _ = require('underscore');


export default class SummaryReport extends Component {
    constructor(props) {
        super();
        this.state = {
          reportData : {
              data : [

              ]
           }
        }

        this.populateSummaryReportDetails();
    }

    componentDidMount(){

    }

    populateSummaryReportDetails(){
      let url = "http://localhost:7071/api/report/generatereport";
      let data = {
            "stores": [
                3,
                5
              ],
         fromDate: "2017-03-03T00:00:00.000Z",
         toDate: "2018-03-26T00:00:00.000Z",
         openTime: "12:08 AM",
         closeTime: null,
         type:1,
         advanceType:true,
         include: 1,
         format: 1,
         templateName: "samples"
      }
      fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              'Accept': 'application/json',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
          },
          body: JSON.stringify(data)
      })
          .then((response) => response.json())
          .then((data) => {
              this.state.reportData.data = JSON.stringify(data.data);
              this.setState(this.state);
          })
          .catch((error) => {
          });

    }

    render() {
        let reportData = this.state.reportData.data;
        return (<section className="reportSummaryPage">
             <HmeHeader />
            <section className="reportSummaryContainer">
              <div className="row downloadBtnSection">
                  <button className="btn btn-default downloadSummaryReportBtn">Download</button>
              </div>
              <div className="row">
                <div className="col-xs-9 summaryHeader">
                  <div className="summaryHeaderText">Summarized Report</div>
                </div>
                <div className="col-xs-3">
                  <img src = {hmeLogo} />
                  <img src = {zoomLogo} />
                </div>
              </div>

              <div className="row">
                <div className="col-xs-6">
                  <div className="col-xs-6">
                    <h2 className="reportStartTimeHeader">
                      <span className="reportStartTime">Start Time:</span>
                      <span className ="reportStartTimeValue">MAR 31,2018 OPEN</span>
                    </h2>
                  </div>
                  <div className="col-xs-6">
                    <h2 className="reportEndTimeHeader">
                      <span className="reportEndTime">End Time:</span>
                      <span className="reportEndTimeValue">MAR 31,2018 OPEN</span>
                    </h2>
                  </div>
                </div>
                <div className = "col-xs-6">
                  <div className="col-xs-6">
                    <h2 className="reportPrintTimeHeader">
                      <span className="reportPrintTime"> Report Print Time</span>
                      <span className="reportPrintTimeValue"> APR2, 2019 4:08 AM</span>
                    </h2>
                  </div>
                  <div className="col-xs-6">
                    <span> Pagination</span>
                  </div>
                </div>
              </div>

              <div className="row">

              </div>

              <div className="row summaryReportTableSection">
                <div className="col-xs-12">
                  <table className="summaryReportTable">
                    <tbody>
                      <tr>
                        <th className="blankHeader"></th>
                        <th className="tableHeading" colSpan="4">
                          <span>AVERAGE TIME</span><span>(min:sec)</span>
                        </th>
                      </tr>
                      <tr>
                        <th className="groupsColHeader"><span>Groups</span></th>
                        <th className="storesColHeader"><span>Stores</span></th>
                        <th className="reportTableAttributesHeading"><span>Menu</span></th>
                        <th className="reportTableAttributesHeading"><span>Greet</span></th>
                        <th className="reportTableAttributesHeading"><span>Service</span></th>
                        <th className="reportTableAttributesHeading"><span>Lane Queue</span></th>
                        <th className="reportTableAttributesHeading"><span>Lane Total</span></th>
                        <th className="reportTableAttributesHeading"><span>Total Cars</span></th>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </section>
        </section>);
    }
}
