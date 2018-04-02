import React, { Component } from "react";
import moment from "moment";
import Header from "../Header/HmeHeader";
import "./SummaryReport.css";

class RawCarReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayData: {
        store: "McDonalds 202000",
        description: "Description of the Store",
        startTime: "2018-03-15",
        stopTime: "2018-03-15",
        printDate: "2018-04-02",
        printTime: "2:59 AM",
        dayPart: "DP OPEN-11:59",
        rawCartData: [
          {
            departureTime: "2018-03-15 09:28:41 AM",
            eventName: "Car_Departure",
            carsInQueue: 3,
            menu: "0:21",
            greet: "0:21",
            service: "0:40",
            laneQueue: "0:39",
            laneTotal: "1:40"
          },
          {
            departureTime: "2018-03-15 09:28:42 AM",
            eventName: "Car_Departure",
            carsInQueue: 3,
            menu: "0:13",
            greet: "0:13",
            service: "0:49",
            laneQueue: "0:44",
            laneTotal: "1:46"
          }
        ]
      }
    };
    this.displayRecords = this.displayRecords.bind(this);
  }
  timeChange(name) {
    return moment(name).format("ll");
  }
 displayResults(name){
   return name.map((items)=>{
      return (
         <tr className="displayResult">
              <td>{items.departureTime}</td>
              <td>{items.eventName}</td>
              <td>{items.carsInQueue}</td>
              <td> {items.menu}</td>
              <td> {items.greet}</td>
              <td> {items.service}</td>
              <td> {items.laneQueue}</td>
              <td> {items.laneTotal}</td>
            </tr>
      )
   })
 }
  displayRecords() {
    if (this.state.displayData.rawCartData.length > 0) {
      return (
        <div>
          <div className="rawcarHeader">
            <h2 className="rawCarh2">{this.state.displayData.dayPart}</h2>
          </div>
          <table className="displayRecords tableLayout">
            <tbody>
            <tr>
              <th>Departure Time</th>
              <th>Event Name</th>
              <th>Cars In Queue</th>
              <th>
                <span>Menu</span>
              </th>
              <th>
                <span>Greet</span>
              </th>
              <th>
                <span>Service</span>
              </th>
              <th>
                <span>Lane Queue</span>
              </th>
              <th>
                <span>Lane Total</span>
              </th>
            </tr>
            {this.displayResults(this.state.displayData.rawCartData)}
            </tbody>
          </table>
        </div>
      );
    } else {
      return <p>No Records Found</p>;
    }
  }
  render() {
    return (
      <div>
        <Header />
        <div className="clear tableDetails">
          <div className="rawcarHeader">
            <h1 className="rawCarH1">
              <span>Raw Car Data Report</span>
            </h1>
          </div>
          <table className="head-labelsRaw clear">
            <tbody>
              <tr>
                <th className="thinHead">
                  <span>Store</span>:
                </th>
                <td className="thinHead">{this.state.displayData.store}</td>
                <th>
                  <span>Start Time:</span>
                </th>

                <td>
                  {this.timeChange(this.state.displayData.startTime)}&nbsp;
                </td>
                <th>
                  <span>Print Date:</span>
                </th>
                <td>{this.timeChange(this.state.displayData.printDate)}</td>
              </tr>
              <tr>
                <th>
                  <span>Description:</span>
                </th>
                <td>{this.state.displayData.description}</td>
                <th>
                  <span>Stop Time:</span>
                </th>
                <td>
                  {this.timeChange(this.state.displayData.stopTime)}&nbsp;
                </td>
                <th>
                  <span>Print Time: </span>
                </th>
                <td>{this.state.displayData.printTime}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {this.displayRecords()}
      </div>
    );
  }
}

export default RawCarReport;
