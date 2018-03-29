import React, { Component } from 'react';
import App from '../../App'
import SuccessAlert from "../Alerts/SuccessAlert"
import ErrorAlert from "../Alerts/ErrorAlert"
import fetch from 'isomorphic-fetch'
import HmeHeader from '../Header/HmeHeader'
import { BrowserRouter as Router, Route , Link  } from 'react-router-dom'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

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

    /*renderStores() {
        let reportData =   this.state.reportData.data;
            let renderStores = reportData.map(function (item, index) {
                return (
                    <div key={index}>{item}</div>
                )
            });
            return renderStores;
    } */

    render() {
        let reportData = this.state.reportData.data;
        return (<section className="reportSummaryPage">
             <HmeHeader />
            <section className="reportSummaryContainer">
              <div>
                  <h1>Summary Report</h1>
              </div>

              <div className="row">
                  <div className="summaryDataContainer">
                    <pre>
                    <code>
                    {this.state.reportData.data}
                    </code>
                    </pre>
                  });
                  </div>
              </div>

            </section>
        </section>);
    }
}
