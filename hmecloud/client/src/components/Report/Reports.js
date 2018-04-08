import React, { Component } from "react";
import { I18n, Trans } from 'react-i18next';
import "../Security/Login.css";
import AuthService from "../Security/AuthenticationService";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import Tree, { TreeNode } from "rc-tree";
import "rc-tree/assets/index.css";
import "../../../node_modules/react-datetime/css/react-datetime.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import DateTimeField from "react-datetime";
import DateTime from "react-datetime";
//import './basic.less';

import "rc-time-picker/assets/index.css";
import moment from "moment";
import TimePicker from "rc-time-picker";
import HmeHeader from "../Header/HmeHeader";
import SuccessAlert from "../Alerts/SuccessAlert";
import ErrorAlert from "../Alerts/ErrorAlert";
import {Config} from '../../Config'
import {CommonConstants} from '../../Constants'
import Api from '../../Api'
import ReactTooltip from 'react-tooltip'

const ProductLogo = require("../../images/ProductLogo-1.png");
const HMELogo = require("../../images/HMELogo.png");
const Calendar = require("../../images/mini-cal.jpg");
const Asc = require("../../images/Arrow_red_asc.png");
const Desc = require("../../images/Arrow_red_desc.png");

const Delete = require("../../images/redEx.png");
const _ = require("underscore");

class Report extends Component {
  // ToDo: Need to be checked with Nandish
  //  state = {
  //   selectedTime: moment()
  // };
  handleValueChange = selectedTime => {
    console.log(selectedTime && selectedTime.format("HH:mm:ss"));
    this.setState({ selectedTime });
  };
  clear = () => {
    this.setState({
      selectedTime: undefined
    });
  };

  static propTypes = {
    keys: PropTypes.array
  };
  static defaultProps = {
    keys: ["0-0-0-0"]
  };
  constructor(props) {
    super(props);
    const keys = props.keys;
    this.state = {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
      mode: "time"
    };
    this.state = {
      selectAll: false,
      selectedList: [],
      showAdvancedOptions: false,
      open: true,
      close: true,
      include: [],
      format: 2,
      type: 2,
      fromDate: moment().format("MM/DD/YYYY"),
      toDate: moment().format("MM/DD/YYYY"),
      selectedOpenTime: null,
      selectedCloseTime: null,
      stores: [],
      tempStore: [],
      saveAsTemplate: false,
      templateName: null,
      savedTemplates: null,
      successMessage: null,
      ErrorMessage: null,
      timeMeasure: 1,
      checkStores: false,
      treeData: [],
      templateData : [],
      selectedStoreIds : []
    };
    this.api = new Api()
    this.getSavedReports();
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.Auth = new AuthService()
    this.getTreeHierarchy()

  }

  getTreeHierarchy() {
      let url = Config.apiBaseUrl + CommonConstants.apiUrls.getGroupHierarchyTree + '?accountId=100&userName=swathikumary@nousinfo.com'
      this.api.getData(url,data => {
        console.log(data.data)
        this.state.treeData = data.data
        this.setState(this.state)
      })
  }

  componentWillMount() {
    if (this.Auth.loggedIn()) this.props.history.replace("/");
  }
  onCheck(checkedKeys, node) {
    this.state.selectedList = checkedKeys;
    this.state.defaultCheckedKeys = checkedKeys;

    this.state.stores = _.pluck(
      _.where(_.pluck(node.checkedNodes, "props"), { type: "store" }),
      "title"
        );
      this.state.selectedStoreIds = _.pluck(
        _.where(_.pluck(node.checkedNodes, "props"), { type: "store" }),
        "value"
          );
    this.setState(this.state);
  }

  getInitialState() {
    var value = new Date().toISOString();
    return {
      value: value
    };
  }
  handleChange(value, formattedValue) {
    this.setState({
      value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedValue: formattedValue // Formatted String, ex: "11/19/2016"
    });
  }
  onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
    this.selKey = info.node.props.eventKey;
  };

  render() {
    const { date, format, mode, inputFormat } = this.state;
    const customLabel = (
      <span className="cus-label">
        <span>operations: </span>
        <span style={{ color: "blue" }} onClick={this.onEdit}>
          Edit
        </span>&nbsp;
        <label onClick={e => e.stopPropagation()}>
          <input type="checkbox" /> checked
        </label>{" "}
        &nbsp;
        <span style={{ color: "red" }} onClick={this.onDel}>
          Delete
        </span>
      </span>
    );

    const loop = data => {
      return data.map(item => {
        if (item.Children && item.Children.length) {
          return (
            <TreeNode title={item.Name} key={item.Id} value={item.Id} type={item.Type}>
              {loop(item.Children)}
            </TreeNode>
          );
        }
        return <TreeNode title={item.Name} key={item.Id} value={item.Id} type={item.Type} />;
      });
    };

    return (
      <I18n ns="translations">
    {
      (t, { i18n }) => (
      <section className="reportsPage">
        <HmeHeader />
        <div className="reports">
          <SuccessAlert successMessage={this.state.successMessage} />
          <ErrorAlert errorMessage={this.state.errorMessage} />
          <header className="reports-header">{t('title')}</header>
          {/* <Trans i18nKey="title">
          </Trans> */}
          <form onSubmit={this.handleSubmit}>
            <section className="reports-pane-section">
              <div className="reports-pane">
                <div className="checkbox-sections-advanced">
                  <div className="timings">
                    {" "}
                    <input
                      type="checkbox"
                      checked={this.state.selectAll}
                      onChange={this.selectAll.bind(this)}
                    />{" "}
                    <span className="span-heading">
                      <span> Select All </span>{" "}
                      <a data-tip="Select one store for a single-store report.  Select multiple stores for a comparison report."><span className="tip openTip">?</span></a>
                      <ReactTooltip place="right" type="dark" effect="solid" />
                    </span>{" "}
                  </div>
                  <div className="timings">
                    {" "}
                    <span>Brand</span>{" "}
                  </div>
                </div>

                <div className="saved-reports">
                  <Tree
                    className="myCls"
                    showLine
                    checkable
                    selectable={false}
                    defaultExpandAll
                    onExpand={this.onExpand}
                    defaultSelectedKeys={this.state.defaultSelectedKeys}
                    defaultCheckedKeys={this.state.defaultCheckedKeys}
                    onSelect={this.onSelect}
                    onCheck={this.onCheck.bind(this)}
                    checkedKeys={this.state.defaultCheckedKeys}
                  >
                    {loop(this.state.treeData)}
                  </Tree>
                </div>
                <span className="span-heading">
                                  <span> Time Measures </span>{" "}
                                  <a data-tip="The report will summarize or average the data over the time intervals you choose. For example, choose week if you want all of the days of each rolled up into one-week intervals. Only one store may be selected at a time for a Raw Data Report."><span className="tip openTip">?</span></a>
                                  <ReactTooltip place="right" type="dark" effect="solid" />
                </span>
                <div>
                  <select
                    name="timeMeasure"
                    className="time-measures"
                    onChange={this.changeTimeMeasure.bind(this)}
                  >
                    <option selected={this.state.timeMeasure == 1} value="1">
                      {" "}
                      Day
                    </option>
                    <option selected={this.state.timeMeasure == 2} value="2">
                      {" "}
                      Daypart
                    </option>
                    <option selected={this.state.timeMeasure == 3} value="3">
                      {" "}
                      Week{" "}
                    </option>
                    <option selected={this.state.timeMeasure == 4} value="4">
                      {" "}
                      Raw Data Report
                    </option>
                  </select>
                </div>
                <div className="calendar-section">
                  <div className="date-from">
                    <span className="span-heading">
                                          <span> From </span>
                                          <a data-tip="Choose a start and end date for the overall time period of the report. Single store can select any 2 month period. Multiple store can select any 1 month period."><span className="tip openTip">?</span></a>
                                          <ReactTooltip place="right" type="dark" effect="solid" />
                    </span>
                    <div className="calendar">
                      <div className="calendar-icon">
                        <img src={Calendar} aria-hidden="true" />{" "}
                      </div>
                      <DateTimeField
                        className="date-time"
                        mode={date}
                        timeFormat={false}
                        inputProps={{ readOnly: true }}
                        closeOnSelect
                        ref="fromDate"
                        value={this.state.fromDate}
                        onChange={e => this.changeDate(e, "from")}
                      />
                    </div>
                  </div>
                  <div className="date-to">
                    <span className="span-heading">
                      <span> To </span>
                      <a data-tip="Choose a start and end date for the overall time period of the report. Single store can select any 2 month period. Multiple store can select any 1 month period."><span className="tip openTip">?</span></a>
                      <ReactTooltip place="right" type="dark" effect="solid" />
                    </span>
                    <div className="calendar">
                      <div className="calendar-icon">
                        <img src={Calendar} aria-hidden="true" />{" "}
                      </div>
                      <DateTimeField
                        className="date-time"
                        mode={date}
                        timeFormat={false}
                        inputProps={{ readOnly: true }}
                        closeOnSelect
                        ref="toDate"
                        value={this.state.toDate}
                        onChange={e => this.changeDate(e, "to")}
                      />
                    </div>
                  </div>
                </div>

                <div>
                                  <div className='advancedOptions' onClick={this.showAdvanced.bind(this)}>
                                         <span className='textPaddingSmall'> Advanced Options </span>
                                         <img src={Asc} className={(this.state.showAdvancedOptions ? "show" : "hidden")} aria-hidden="true" />{" "}
                                         <img src={Desc} className={(this.state.showAdvancedOptions ? "hidden" : "show")}  aria-hidden="true" />{" "}
                                 </div>
                  <div
                    className={
                      "advanced-option-section " +
                      (this.state.showAdvancedOptions ? "show" : "hidden")
                    }
                  >
                    <div className="checkbox-sections-advanced">
                      <div className="timings">
                        <TimePicker
                          defaultValue={this.state.openTime}
                          onChange={this.handleValueChange}
                          showSecond={false}
                          use12Hours={true}
                          disabled={this.state.open}
                          onChange={this.timeChange.bind(this, "openTime")}
                          name="open"
                          value={this.state.openTime}
                        />
                      </div>
                      <div className="timings">
                        <TimePicker
                          defaultValue={this.state.closeTime}
                          onChange={this.handleValueChange}
                          showSecond={false}
                          use12Hours={true}
                          disabled={this.state.close}
                          onChange={this.timeChange.bind(this, "closeTime")}
                          name="close"
                          value={this.state.closeTime}
                        />
                      </div>
                    </div>

                    <div className="checkbox-sections-advanced">



                                          <div className="alignCenter timings">
                                              <input
                                                  name="open"
                                                  type="checkbox"
                                                  checked={this.state.open}
                                                  onChange={this.check.bind(this, this.state.open)}
                                              />
                                              <span className="textPaddingSmall">  Open  <a data-tip="Leave the Open and/or Close boxes checked if you want the start and/or end times to remain as configured in the ZOOM timer.  Uncheck the box(es) if you want to choose a specific start and/or end time."><span className="tip openTip">?</span></a>
                                                  <ReactTooltip place="right" type="dark" effect="solid" /> </span>
                                          </div>


                  
                      <div className="timings">
                        {" "}
                        <input
                          name="close"
                          type="checkbox"
                          checked={this.state.close}
                          onChange={this.check.bind(this, this.state.close)}
                        />{" "}
                        <span className="span-heading">
                          <span> Close </span>{" "}
                          <a data-tip="Leave the Open and/or Close boxes checked if you want the start and/or end times to remain as configured in the ZOOM timer.  Uncheck the box(es) if you want to choose a specific start and/or end time."><span className="tip openTip">?</span></a>
                          <ReactTooltip place="right" type="dark" effect="solid" />
                        </span>{" "}
                      </div>
                    </div>
                    <span>Type </span>
                    <div className="checkbox-sections">
                      <div className="type-sub-section">
                        {" "}
                        <input
                          type="radio"
                          name="type"
                          checked={this.state.type == 1 ? true : false}
                          onChange={this.handleOnChange.bind(this)}
                          value={1}
                        />{" "}
                        <span className="span-heading">
                          <span> Time Slice </span>{" "}
                          <a data-tip="Choose Time Slice if you are only interested in a narrow window of time within each daypart, day, or week.  Use the controls above to choose a start and end time."><span className="tip openTip">?</span></a>
                          <ReactTooltip place="right" type="dark" effect="solid" />
                        </span>
                      </div>
                      <div className="type-sub-section">
                        {" "}
                        <input
                          type="radio"
                          name="type"
                          checked={this.state.type == 2 ? true : false}
                          onChange={this.handleOnChange.bind(this)}
                          value={2}
                        />{" "}
                        <span className="span-heading">
                          <span> Cumulative </span>{" "}
                          <a data-tip="Choose Cumulative if you want the report to include everything from the chosen start  date and time to the chosen end date and time."><span className="tip openTip">?</span></a>
                          <ReactTooltip place="right" type="dark" effect="solid" />
                        </span>{" "}
                      </div>
                    </div>
                    <span className="note">
                      {" "}
                      *Reports including Advanced Options are generated by CSV
                      and sent by email.{" "}
                    </span>
                  </div>
                </div>

                <span>Include </span>
                <div className="checkbox-sections">

                                  <div className="alignCenter">
                                      <input
                                          type="checkbox"
                                          id="longestTime"
                                          disabled={this.state.showAdvancedOptions}
                                          value={1}
                                          onChange={this.include.bind(this)}
                                      />
                                      <span className="textPaddingSmall">  Longest Time </span>
                                  </div>
                                  <div className="alignCenter">
                                      <input
                                          type="checkbox"
                                          id="systemStatistics"
                                          disabled={this.state.showAdvancedOptions}
                                          value={2}
                                          onChange={this.include.bind(this)}
                                      />
                                      <span className="textPaddingSmall">  System Statistics </span>
                                  </div>
                                 </div>
                <span className="span-heading">
                                  <span> Format </span> 
                                  <a data-tip="Select one store for a single-store report.  Select multiple stores for a comparison report."><span className="tip openTip">?</span></a>
                                  <ReactTooltip place="right" type="dark" effect="solid" />
                </span>
                <div className="checkbox-sections">
                                  <div className="alignCenter">
                                      <input
                                          type="radio"
                                          name="format"
                                          checked={this.state.format == 1 ? true : false}
                                          onChange={this.handleOnChange.bind(this)}
                                          value={1}
                                      />
                                      <span className="textPaddingSmall">  Seconds(sec) </span>
                                  </div>
                                  <div className="alignCenter">
                                      <input
                                          type="radio"
                                          name="format"
                                          checked={this.state.format == 2 ? true : false}
                                          onChange={this.handleOnChange.bind(this)}
                                          value={2}
                                      />
                                      <span className="textPaddingSmall"> Minutes(min:sec) </span>
                                  </div>
                </div>
              </div>
              <div className="reports-pane">
                <span className="span-heading">
                  <span> Saved Reports Templates </span>{" "}
                  <a data-tip="Select a previously saved report template to run a common report, or select new options and save a new report template to use later."><span className="tip openTip">?</span></a>
                  <ReactTooltip place="right" type="dark" effect="solid" />
                </span>
                <div className="saved-reports">{this.savedReports()}</div>
                <span>Criteria</span>
                <div className="container criteria">
                  <div className="col-md-12">
                    {" "}
                    Stores :
                    {this.state.stores.length ? this.renderStores() : "Select a Store"}{" "}
                  </div>
                  <div className="col-md-6"> From: {this.state.fromDate} </div>
                  <div className="col-md-6"> To: {this.state.toDate}</div>
                  <div className="col-md-12">
                    {" "}
                    Time Measure:{this.state.timeMeasure == 1
                      ? "Day"
                      : this.state.timeMeasure == 2
                        ? "Daypart"
                        : this.state.timeMeasure == 3
                          ? "Week"
                          : this.state.timeMeasure == 4
                            ? "Raw Data Report"
                            : ""}
                  </div>
                  <div className="col-md-12">
                    {" "}
                    Include:
                    {this.state.include.length ? this.renderInclude() : "None"}
                  </div>
                  <div className="col-md-12">
                    {" "}
                    Format:{" "}
                    {this.state.format == 1
                      ? "Seconds(sec)"
                      : this.state.format == 2 ? "Minutes(min:sec)" : ""}
                  </div>
                </div>
                <div className="alignCenter">
                  <input
                    name="saveAsTemplate"
                    type="checkbox"
                    value={this.state.saveAsTemplate}
                    onChange={this.check.bind(this, this.state.saveAsTemplate)}
                  />
                  <span className="textPaddingLarge"> Save as Template </span>
                </div>
                <div>
                  <input
                    name="templateName"
                    className="save-template"
                    placeholder="  (Name this template)"
                    value={this.state.templateName}
                    onChange={this.handleOnChange.bind(this)}
                    maxLength={25}
                  />
                </div>
                <div
                  type="submit"
                  className="generate-reports"
                  onClick={this.generate.bind(this)}
                >
                  {" "}
                  Generate Report{" "}
                </div>
              </div>
            </section>
          </form>
        </div>
      </section>
     )
    }
    </I18n>
    );
  }

  timeChange(name, e) {
    let self = this;
    self.setState({
      [name]: moment(e, "HH:mm A")
    });
  }

  handleOnChange(e) {
    const { name, value } = e.target;
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  check(value, e) {
    if (!value) {
      this.setState({
        [e.target.name]: !value
      });
    }
    this.setState({
      [e.target.name]: !value
    });
  }
  handleFormSubmit(e) {
    e.preventDefault();

    this.Auth.login(this.state.username, this.state.password)
      .then(token => {
        this.setState({
          token: token
        });
        const url = Config.jwtUrl + token;
        //window.location.href('url');
        window.location.assign(url);
        this.props.history.replace(url);
      })
      .catch(err => {
        console.log(err);
      });
  }

  showAdvanced(e) {
    let showAdvancedOptions = this.state.showAdvancedOptions;
    if (!showAdvancedOptions) {
      this.setState({ include: [] });
    }
    document.getElementById("longestTime").checked = false;
    document.getElementById("systemStatistics").checked = false;
    this.setState({
      showAdvancedOptions: !showAdvancedOptions
    });
  }

  getSavedReports() {
    /*fetch(
      Config.baseUrl + CommonConstants.apiUrls.getSavedTemplateList + '?accountId=100&createdBy=1000',
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache"
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          savedTemplates: data.data
        });
      })
      .catch(error => {});*/
      let url = Config.baseUrl + CommonConstants.apiUrls.getSavedTemplates + '?accountId=100&createdBy=1000'
      this.api.getData(url,data => {
        this.setState({
          savedTemplates: data.data
        })
      }, error => {
        console.log(error)
      })
  }

  savedReports() {
    let savedTemplates = this.state.savedTemplates;

    if (savedTemplates) {
      let renderSavedTemplates = savedTemplates.map((report, index) => {
        return (
          <div key={index} title={report.TemplateName}>
            <div
              className="col-md-10 savedName"
              id={report.Id}
              onClick={this.apply.bind(this)}
            >
              {" "}
              {report.TemplateName}{" "}
            </div>
            <div
              className="col-md-2 delete-icon"
              id={report.Id}
              onClick={this.delete.bind(this)}
            >
              {" "}
              <span id={report.Id}>
                <img
                  className="logOutIcon"
                  id={report.Id}
                  src={Delete}
                  aria-hidden="true"
                />
              </span>{" "}
            </div>
          </div>
        );
      });
      return renderSavedTemplates;
    }
  }

  renderTimeMeasures() {
    let timeMeasures =
      this.state.timeMeasures &&
      this.state.timeMeasures.map(function(timeMeasure, index) {
        return <option value={timeMeasure.Id}>{timeMeasure.Type}</option>;
      });
    return timeMeasures;
  }

  changeTimeMeasure(e) {
    const { name, value } = e.target;
    this.setState({
      timeMeasure: value
    });
  }

  findMatch(list, keys) {
    let selectedItems = [];
    let selectedList = [];
    let findStore = function(items) {
      items.map(item => {
        if (item.Children && item.Children.length) {
          findStore(item.Children);
        }
        if (keys(item)) {
          // if ( item.Type === 'store' && keys.indexOf(item.Id.toString()) > -1) {
          selectedItems.push(item.Name);
          selectedList.push(item.Id);
        }
      });
    };

    findStore(list);
    this.setState({
      selectedList: selectedList
    });
    return selectedItems;
  }

  findMatchedIds(list, keys) {
    let selectedList = [];
    let findStore = function(items) {
      items.map(item => {
        if (item.Children && item.Children.length) {
          findStore(item.Children);
        }
        if (keys(item)) {
          selectedList.push(item.Id);
        }
      });
    };


    findStore(list);
    return selectedList;
  }

  apply(e) { 

  let url = Config.baseUrl + CommonConstants.apiUrls.getSavedTemplateData + '?templetId=' +
    e.target.id;
    this.api.getData (url,data => {
        let template = data.data;
        this.setState({ tempStore: template.selectedList });
        this.setState({ format: template.format });
        this.setState({ type: template.type });
        this.setState({ open: template.open });
        this.setState({ close: template.close });
        this.setState({ timeMeasure: template.timeMeasure });
        let fromDate = moment(template.fromDate).format("DD/MM/YYYY");
        this.setState({ fromDate: fromDate });
        let toDate = moment(template.toDate).format("DD/MM/YYYY");
        this.setState({ toDate: toDate });
        this.setState({ defaultCheckedKeys: template.selectedList });
        let selectedStoreIds = []
        this.setState({
          stores: this.findMatch(this.state.treeData, item => {
            if(item.Type === "store" && template.selectedList.indexOf(item.Id.toString()) > -1){
              selectedStoreIds.push(item.Id);
            }
            return (
              item.Type === "store" &&
              template.selectedList.indexOf(item.Id.toString()) > -1
            );
          })
        });
        this.setState({
          selectedStoreIds : selectedStoreIds
        })
        if (_.contains(template.include, "1")) {
          document.getElementById("longestTime").checked = true;
        }
        if (_.contains(template.include, "2")) {
          document.getElementById("systemStatistics").checked = true;
        }
        this.setState({ include: template.include });

        if (template.open == false) {
          this.state.openTime = moment(template.openTime, "HH:mm a");
          this.setState(this.state);
        }
        if (template.close == false) {
          this.state.closeTime = moment(template.closeTime, "HH:mm a");
          this.setState(this.state);
        }
      }, error => {
        console.log(error)
      })
    }

  delete (e) {
    // console.log(e.target.id);

    /*fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache"
      }
    })
      .then(response => response.json())
      .then(data => {
        this.state.successMessage = data.data;
        this.state.errorMessage = "";
        this.setState(this.state);
        this.getSavedReports();
      })
      .catch(error => {
        this.state.errorMessage = "ERROR";
        this.state.successMessage = "";
        this.setState(this.state);
      });*/
    let url = Config.baseUrl + CommonConstants.apiUrls.deleteTemplate + '?templetId=' +
      e.target.id;
    this.api.deleteData (url,data => {
      this.state.successMessage = data.data;
      this.state.errorMessage = "";
      this.setState(this.state);
      this.getSavedReports();
    }, error => {
      this.state.errorMessage = "ERROR";
      this.state.successMessage = "";
      this.setState(this.state);
    })
  }

  generate(e) {
    this.setState({ errorMessage: "" });
    let isError = false;
    let template = [];
    template.push({
      selectedList: this.state.selectedList,
      timeMeasure: this.state.timeMeasure,
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      openTime: moment(this.state.openTime).format("HH:mm a"),
      closeTime: moment(this.state.closeTime).format("HH:mm a"),
      templateName: this.state.templateName,
      open: this.state.open,
      close: this.state.close,
      type: this.state.type,
      include: this.state.include,
      format: this.state.format,
      selectedStoreIds: this.state.selectedStoreIds
    });
    this.state.templateData = template;
    this.setState(this.state);
    console.log(JSON.stringify(template[0]));

    //validations
    if (this.state.toDate < this.state.fromDate) {
      this.state.errorMessage =
        "Date range invalid. Starting date may not be beyond ending date.";
      this.setState(this.state);
    }

    if (this.state.selectedList.length == 0) {
      this.state.errorMessage = "Please Select a store";
      this.setState(this.state);
      isError = true;
    }

    if (this.state.timeMeasure == 1) {
      if (
        moment(this.state.toDate, "MM/DD/YYYY").diff(
          moment(this.state.fromDate, "MM/DD/YYYY"),
          "days"
        ) > 31
      ) {
        this.state.errorMessage =
          "Date range invalid. For Day Reports select any 1 month period.";
        this.setState(this.state);
        isError = true;
      }
    }

    if (this.state.timeMeasure == 2) {
      if (
        moment(this.state.toDate, "MM/DD/YYYY").diff(
          moment(this.state.fromDate, "MM/DD/YYYY"),
          "days"
        ) > 14
      ) {
        this.state.errorMessage =
          "Date range invalid. For Daypart Reports select any 2 week period.";
        this.setState(this.state);
        isError = true;
      }
    }

    if (this.state.timeMeasure == 3) {
      if (
        moment(this.state.toDate, "MM/DD/YYYY").diff(
          moment(this.state.fromDate, "MM/DD/YYYY"),
          "days"
        ) > 62
      ) {
        this.state.errorMessage =
          "Date range invalid. For Week Reports select any 2 month period.";
        this.setState(this.state);
        isError = true;
      }
    }
    if (this.state.timeMeasure == 4) {
      if (
        moment(this.state.toDate, "MM/DD/YYYY").diff(
          moment(this.state.fromDate, "MM/DD/YYYY"),
          "days"
        ) > 0
      ) {
        this.state.errorMessage =
          "Date range invalid. For Raw Data Reports select a single day.";
        this.setState(this.state);
        isError = true;
      }
    }
    // console.log((moment(this.state.toDate, 'MM/DD/YYYY').diff(moment(this.state.fromDate, 'MM/DD/YYYY'),'days')));
    if (this.state.saveAsTemplate) {
      if (!this.state.templateName) {
        this.state.errorMessage =
          "Please enter a template name to save a template"
        this.setState(this.state)
        isError = true;
      } else {
        //let url = config.url+"api/reportTemplate/create"
        /*fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache"
          },
          body: JSON.stringify(template[0])
        })
          .then(response => response.json())
          .then(data => {
            this.state.successMessage = data.data;
            this.state.errorMessage = "";
            this.setState(this.state);
            this.getSavedReports();
          })
          .catch(error => {
            this.state.errorMessage = "ERROR";
            this.state.successMessage = "";
            this.setState(this.state);
          });*/
          let url = Config.baseUrl + CommonConstants.apiUrls.createTemplate + '?templetId=' +
            e.target.id;
          this.api.postData (url, template[0] ,data => {
            this.state.successMessage = data.data;
            this.state.errorMessage = "";
            this.setState(this.state);
            this.getSavedReports();
          }, error => {
            this.state.errorMessage = "ERROR";
            this.state.successMessage = "";
            this.setState(this.state);
          })
      }
    }
    if (!isError) {
      this.props.history.push("/summaryreport",this.state.templateData);
    }
  }

  changeDate(date, dateSelection) {
    let selectedDate = moment(date, "MM/DD/YYYY").format("MM/DD/YYYY");
    if (dateSelection == "from") {
      this.setState({
        fromDate: selectedDate
      });
    } else if (dateSelection == "to") {
      this.setState({
        toDate: selectedDate
      });
    }
  }

  include(e) {
    let include = this.state.include;
    if (_.contains(include, e.target.value)) {
      include = _.filter(include, function(value) {
        return value !== e.target.value;
      });
    } else {
      include.push(e.target.value);
    }
    this.setState({
      include: include
    });
  }

  renderInclude(e) {
    let include = this.state.include;
    let renderInclude;
    if (include) {
      renderInclude = include.map(function(include, index) {
        return (
          <span key={index}>
            <span className={index == 0 ? "hidden" : ""}>,</span>{" "}
            {include == 1
              ? "Longest Time"
              : include == 2 ? "System Statistics" : ""}
          </span>
        );
      });
    } else {
      renderInclude = include.map(function(include, index) {
        return <span>None</span>;
      });
    }
    return renderInclude;
  }

  renderStores() {
    let renderStores;
    let stores = this.state.stores;
    renderStores = stores.map(function(store, index) {
      return (
        <span key={index}>
          <span className={index == 0 ? "hidden" : ""}>,</span> {store}
        </span>
      );
    });
    return renderStores;
  }

  selectAll(e) {
    if (!this.state.selectAll) {
      this.setState({
        defaultCheckedKeys: _.pluck(this.state.treeData, "Id").map(String),
        stores: this.findMatch(this.state.treeData, item => {
          return item.Type === "store";
        }),
        selectedList: this.findMatchedIds(this.state.treeData, item => {
          return true;
        }),
        selectedStoreIds: this.findMatchedIds(this.state.treeData, item => {
          return item.Type === "store";
        })
      });
     } else {
      this.setState({ defaultCheckedKeys: [],
                      selectedList:[],
                      stores:[]
       });
    }
    this.setState({
      selectAll: !this.state.selectAll
    });
  }
}

export default Report;
