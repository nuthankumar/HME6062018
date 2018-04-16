import React, { Component } from "react";
import { I18n, Trans } from 'react-i18next';
import "../Security/Login.css";
// import AuthService from "../Security/AuthenticationService";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import Tree, { TreeNode } from "rc-tree";
import "rc-tree/assets/index.css";
import "../../../node_modules/react-datetime/css/react-datetime.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import DateTimeField from "react-datetime";
import DateTime from "react-datetime";
import "rc-time-picker/assets/index.css";
import moment from "moment";
import TimePicker from "rc-time-picker";
import SuccessAlert from "../Alerts/SuccessAlert";
import ErrorAlert from "../Alerts/ErrorAlert";
import {Config} from '../../Config'
import {CommonConstants} from '../../Constants'
import Api from '../../Api'
import ReactTooltip from 'react-tooltip'
import * as Enum from '../../Enums'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
const ProductLogo = require("../../images/ProductLogo-1.png");
const HMELogo = require("../../images/HMELogo.png");
const Calendar = require("../../images/mini-cal.jpg");
const Asc = require("../../images/Arrow_red_asc.png");
const Desc = require("../../images/Arrow_red_desc.png");
const Delete = require("../../images/redEx.png");
const _ = require("underscore");

class Report extends Component {
  handleValueChange = selectedTime => {
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
      currentLanguage: languageSettings.getCurrentLanguage(),
      selectAll: false,
      selectedList: [],
      showAdvancedOptions: false,
      open: true,
      close: true,
      openTime:'',
      closeTime:'',
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
      selectedStoreIds: [],
      disableIncludes:false,
      reportData:{
        generate: false,
        weeklyData: false,
        dailyData: false,
        dayPartData: false,
        rawCarData: false,
        pagination: true,
        currentPage: null,
        groupStoreColumns: false,
        dayColumn: false,
        dayPartColumn: false,
        weekColumn: false,
        singleStore: false,
        longestTime: false,
	      systemStatistics: false
      }
    };
    this.api = new Api()
    this.getSavedReports();
    // this.handleFormSubmit = this.handleFormSubmit.bind(this);
    // this.Auth = new AuthService()
    this.getTreeHierarchy()

  }

  getTreeHierarchy() {
      let url = Config.apiBaseUrl + CommonConstants.apiUrls.getGroupHierarchyTree
      this.api.getData(url,data => {
        this.state.treeData = data.data
        this.setState(this.state)
      })
  }

  componentWillMount() {
    // if (this.Auth.loggedIn()) this.props.history.replace("/");
  }
  onCheck(checkedKeys, node) {
    this.state.selectedList = checkedKeys;
    this.state.defaultCheckedKeys = checkedKeys;
    this.state.stores = _.pluck(_.where(_.pluck(node.checkedNodes, "props"), { type: "store" }),"title");
    let selectedStoreIds = _.pluck(_.where(_.pluck(node.checkedNodes, "props"), { type: "store" }), "value");
    this.state.selectedStoreIds = selectedStoreIds;
    this.setState(this.state);

    if (selectedStoreIds.length > 1) {
        this.setState({ include: [] });
        document.getElementById("longestTime").checked = false;
        document.getElementById("systemStatistics").checked = false;
        this.setState({ disableIncludes: true })
    }
    else {
        this.setState({ disableIncludes: false })
    }
  }

  getInitialState() {
    var value = new Date().toISOString();
    return {
      value: value
    };
  }
  onSelect = (selectedKeys, info) => {

    this.selKey = info.node.props.eventKey;
  };

  render() {
    const language = this.state.currentLanguage
    const { date, format, mode, inputFormat } = this.state;
    const loop = data => {
      console.log(data); 
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
    //  <I18n ns="translations">
    //{
    //  (t, { i18n }) => (
      <section className="reportsPage">
        <div className="reports">
          <SuccessAlert successMessage={this.state.successMessage} />
          <ErrorAlert errorMessage={this.state.errorMessage} />
          <header className="reports-header">{t[language].summaryReport}</header>
          {/* <Trans i18nKey="title">
          </Trans> */}
          <form onSubmit={this.handleSubmit}>
            <section className="reports-pane-section">
              <div className="reports-pane">
                <div className="checkbox-sections-advanced">
                  <div className="timings">
                    <input type="checkbox" id="includeTime"  checked={this.state.selectAll}
                      onChange={this.selectAll.bind(this)}/>
								<label className="label-heading" for="includeTime">{t[language].selectall}</label>
                  </div>
                  <div className="timings">
                                    <span> {t[language].brand} </span>
                                    <a data-tip={t[language].selectonestore}><span className="tip openTip">?</span></a>
                                    <ReactTooltip place="right" type="dark" effect="solid" />
                  </div>
                </div>

                <div className="saved-reports">
                  <Tree
                    className="myCls"
                    showIcon={false}
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
                                <span> {t[language].timemeasure} </span>

                                  <a data-tip={t[language].thereportwillsummarize}><span className="tip openTip">?</span></a>
                                  <ReactTooltip place="right" type="dark" effect="solid" />
                </span>
                <div>
                                <select name="timeMeasure" className="time-measures" onChange={this.changeTimeMeasure.bind(this)}>
                                    <option selected={this.state.timeMeasure == 1} value="1">{t[language].day}</option>
                                    <option selected={this.state.timeMeasure == 2} value="2">{t[language].daypart}</option>
                                    <option selected={this.state.timeMeasure == 3} value="3">{t[language].week}</option>
                                    <option selected={this.state.timeMeasure == 4} value="4">{t[language].rawdatareport}</option>
                  </select>
                </div>
                <div className="calendar-section">
                  <div className="date-from">
                    <span className="span-heading">
                                        <span>  {t[language].from} </span>
                                        <a data-tip={t[language].choosestartorend}><span className="tip openTip">?</span></a>
                                          <ReactTooltip place="right" type="dark" effect="solid" />
                    </span>
                    <div className="calendar">
                      <div className="calendar-icon">
                        <img src={Calendar} aria-hidden="true" />
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
                                        <span>  {t[language].to} </span>

                                        <a data-tip={t[language].choosestartorend}><span className="tip openTip">?</span></a>
                      <ReactTooltip place="right" type="dark" effect="solid" />
                    </span>
                    <div className="calendar">
                      <div className="calendar-icon">
                        <img src={Calendar} aria-hidden="true" />
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
                                    <span className='textPaddingSmall'> {t[language].advancedoptions} </span>
                                         <img src={Asc} className={(this.state.showAdvancedOptions ? "show" : "hidden")} aria-hidden="true" />
                                         <img src={Desc} className={(this.state.showAdvancedOptions ? "hidden" : "show")}  aria-hidden="true" />
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
                          <span className="textPaddingSmall">  {t[language].open}
                                       <a data-tip={t[language].leavetheopencloseboxes}><span className="tip openTip">?</span></a>
                          <ReactTooltip place="right" type="dark" effect="solid" /> </span>
                      </div>
                      <div className="timings">
                       <input
                          name="close"
                          type="checkbox"
                          checked={this.state.close}
                          onChange={this.check.bind(this, this.state.close)}
                        />
                        <span className="span-heading">
                                                <span> {t[language].close} </span>
                                                <a data-tip={t[language].leavetheopencloseboxes}><span className="tip openTip">?</span></a>
                          <ReactTooltip place="right" type="dark" effect="solid" />
                        </span>
                      </div>
                    </div>
                    <span>{t[language].type}</span>
                    <div className="checkbox-sections">
                      <div className="type-sub-section">
                        <input
                          type="radio"
                          name="type"
                          checked={this.state.type == 1 ? true : false}
                          onChange={this.handleOnChange.bind(this)}
                          value={1}
                        />
                        <span className="span-heading">
                                                <span> {t[language].timeslice}</span>
                          <a data-tip={t[language].choosetimeslice}><span className="tip openTip">?</span></a>
                          <ReactTooltip place="right" type="dark" effect="solid" />
                        </span>
                      </div>
                      <div className="type-sub-section">
                        <input type="radio" name="type" checked={this.state.type == 2 ? true : false} onChange={this.handleOnChange.bind(this)} value={2}/>
                        <span className="span-heading">
                                                <span> {t[language].cumulative} </span>
                          <a data-tip={t[language].choosecumulative}><span className="tip openTip">?</span></a>
                          <ReactTooltip place="right" type="dark" effect="solid" />
                        </span>
                      </div>
                    </div>
                    <span className="note">{t[language].reportsadvancedreport} </span>
                  </div>
                </div>
                <span>{t[language].include}  </span>
                <div className="checkbox-sections">
                          <div className="alignCenter">
                                    <input type="checkbox" id="longestTime" disabled={this.state.showAdvancedOptions || this.state.disableIncludes} value={1} onChange={this.include.bind(this)}/>
                                      <span className="textPaddingSmall"> {t[language].longesttimes} </span>
                                  </div>
                                  <div className="alignCenter">
                                      <input
                                          type="checkbox"
                                        id="systemStatistics"
                                        disabled={this.state.showAdvancedOptions || this.state.disableIncludes}
                                          value={2}
                                          onChange={this.include.bind(this)}
                                      />
                                      <span className="textPaddingSmall">  {t[language].systemstats} </span>
                                  </div>
                                 </div>
                <span className="span-heading">
                                <span> {t[language].format}  </span>

                                <a data-tip={t[language].selectonestore}><span className="tip openTip">?</span></a>
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
                                      <span className="textPaddingSmall"> {t[language].secondswformat} </span>
                                  </div>
                                  <div className="alignCenter">
                                      <input
                                          type="radio"
                                          name="format"
                                          checked={this.state.format == 2 ? true : false}
                                          onChange={this.handleOnChange.bind(this)}
                                          value={2}
                                      />
                                      <span className="textPaddingSmall"> {t[language].minuteswformat}  </span>
                                  </div>
                </div>
              </div>
              <div className="reports-pane">
                <span className="span-heading">
                                <span>  {t[language].savedreporttemplates}  </span>
                                <a data-tip={t[language].selectapreviousreport}><span className="tip openTip">?</span></a>
                  <ReactTooltip place="right" type="dark" effect="solid" />
                </span>
                <div className="saved-reports">{this.savedReports()}</div>
                <span>{t[language].criteria} </span>
                <div className="container criteria">
                  <div className="col-md-12 storeWrap">

                                    <span className="criteriaHeading">{t[language].stores} :</span>
                    {this.state.stores.length ? this.renderStores() : "Select a Store"}
                  </div>
                  <div className="col-md-6"> <span className="criteriaHeading">{t[language].from} :</span>{this.state.fromDate} </div>
                  <div className="col-md-6"> <span className="criteriaHeading">{t[language].to} :</span>{this.state.toDate}</div>
                  <div className="col-md-12">
                      <span className="criteriaHeading">{t[language].timemeasure} :</span>{this.state.timeMeasure == 1
                       ? t[language].day
                      : this.state.timeMeasure == 2
                                            ? t[language].daypart
                                            : this.state.timeMeasure == 3
                                                ? t[language].week
                                                : this.state.timeMeasure == 4
                                                    ? t[language].rawdatareport
                            : ""}
                  </div>
                  <div className="col-md-12">
                      <span className="criteriaHeading">{t[language].include} :</span>{this.state.include.length ? this.renderInclude() : "None"}
                  </div>
                  <div className="col-md-12">
                                    <span className="criteriaHeading">{t[language].format}  :</span>
                                    {this.state.format == 1
                                        ? t[language].secondswformat
                                        : this.state.format == 2 ? t[language].minuteswformat : ""}
                  </div>
                </div>
                <div className="alignCenter">
                  <input
                    name="saveAsTemplate"
                    type="checkbox"
                    value={this.state.saveAsTemplate}
                    onChange={this.check.bind(this, this.state.saveAsTemplate)}
                  />
                  <span className="textPaddingLarge"> {t[language].saveastemplate}  </span>
                </div>
                <div>
                  <input
                    name="templateName"
                    className="save-template"
                    placeholder={t[language].namethistemplate}
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
                  {t[language].generatereport}
                </div>
              </div>
            </section>
          </form>
        </div>
      </section>
   //  )
    //}
    //</I18n>
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

    // this.Auth.login(this.state.username, this.state.password)
    //   .then(token => {
    //     this.setState({
    //       token: token
    //     });
    //     const url = Config.jwtUrl + token;
    //     //window.location.href('url');
    //     window.location.assign(url);
    //     this.props.history.replace(url);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
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
      let url = Config.apiBaseUrl + CommonConstants.apiUrls.getSavedTemplates
      this.api.getData(url, data => {
console.log(data);
          this.state.savedTemplates = []
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
          <div className='templateRow' key={index} title={report.templateName}>
                <div className={"col-md-10 savedName " +(index % 2 === 0 ? "even" : "odd")} id={report.id} onClick={this.apply.bind(this)}>
                   {report.templateName}
                </div>
            <div className={"col-md-2 delete-icon " +(index % 2 === 0 ? "even" : "odd")} id={report.id} onClick={this.delete.bind(this)}>
              <span id={report.id}>
                <img className="logOutIcon" id={report.id} src={Delete} aria-hidden="true"/>
              </span>
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

      let url = Config.apiBaseUrl + CommonConstants.apiUrls.getSavedTemplateData + '?templateId=' +
    e.target.id;
    this.api.getData (url,data => {
        let template = data.data;
//        this.setState({ tempStore: template.SelectedList });
        this.setState({ format: template.Format });
        this.setState({ type: template.Type });
        this.setState({ open: template.Open });
        this.setState({ close: template.Close });
        this.setState({ timeMeasure: template.TimeMeasure });
        let fromDate = moment(template.FromDate).format("MM/DD/YYYY");
        this.setState({ fromDate: fromDate });
        let toDate = moment(template.ToDate).format("MM/DD/YYYY");
        this.setState({ toDate: toDate });
        this.setState({ defaultCheckedKeys: template.SelectedStoreIds });
        // let selectedStoreIds = []
        // this.setState({
        //   stores: this.findMatch(this.state.treeData, item => {
        //     if(item.Type === "store" && template.SelectedList.indexOf(item.Id.toString()) > -1){
        //       selectedStoreIds.push(item.Id);
        //     }
        //     return (
        //       item.Type === "store" &&
        //       template.SelectedList.indexOf(item.Id.toString()) > -1
        //     );
        //   })
        // });
        //  this.setState({
        //    selectedStoreIds : selectedStoreIds
        //  })
          this.setState({
           stores: this.findMatch(this.state.treeData, item => {
             return (
               item.Type === "store" &&
               template.SelectedStoreIds.indexOf(item.Id.toString()) > -1
             );
           })
         });
         this.setState({
          selectedStoreIds :  template.SelectedStoreIds
        })
        let include = []
        if(template.LongestTime){
          document.getElementById("longestTime").checked = true;
          include.push('1')
        }
        else{
          document.getElementById("longestTime").checked = false;
        }
        if(template.SystemStatistics){
          
          document.getElementById("systemStatistics").checked = true;
          include.push('2')
        }
        else{
          document.getElementById("systemStatistics").checked = false;
        }
        this.setState({ include: include });
        // _.contains(template.Include, "1") ? document.getElementById("longestTime").checked = true : ''
        // _.contains(template.Include, "2") ? document.getElementById("systemStatistics").checked = true:''
         //this.setState({ include: template.Include });
        if (template.Open == false) {
          this.state.openTime = moment(template.OpenTime, "HH:mm a");
          this.setState(this.state);
        }
        if (template.Close == false) {
          this.state.closeTime = moment(template.CloseTime, "HH:mm a");
          this.setState(this.state);
        }
      }, error => {
        console.log(error)
      })
    }

  delete (e) {
      let url = Config.apiBaseUrl + CommonConstants.apiUrls.deleteTemplate + '?templateId=' +
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
    let language = this.state.currentLanguage;
    this.state.reportData.generate = true
    this.setState({ errorMessage: "" });
    let isError = false;
    let template = [];
    let createTemplateData = []
    this.openTime = moment(this.state.openTime).format("HH:mm a")
    this.closeTime = moment(this.state.closeTime).format("HH:mm a")
    if(this.openTime === 'Invalid date'){
     this.openTime = ''
    }else{
     this.openTime = moment(this.state.openTime).format("HH:mm a")
    }
    if(this.closeTime === 'Invalid date'){
       this.closeTime = ''
    }else{
      this.closeTime = moment(this.state.closeTime).format("HH:mm a")
    }
    template.push({
      selectedList: this.state.selectedList,timeMeasure: this.state.timeMeasure,fromDate: this.state.fromDate,toDate: this.state.toDate,
      openTime: this.openTime,closeTime: this.closeTime,
      templateName: this.state.templateName, open: this.state.open, close: this.state.close,
      type: this.state.type, include: this.state.include, format: this.state.format, selectedStoreIds: this.state.selectedStoreIds,
      CreatedDateTime: moment().format("YYYY-MM-DD HH:mm:ss a"), UpdatedDateTime: moment().format("YYYY-MM-DD HH:mm:ss a"),
      advancedOptions: (!this.state.open || !this.state.close), longestTime: _.contains(this.state.include, "1"),systemStatistics: _.contains(this.state.include, "2"),
    });

    createTemplateData.push({
      selectedList: this.state.selectedList,timeMeasure: this.state.timeMeasure,fromDate: this.state.fromDate,toDate: this.state.toDate,
      openTime: this.openTime,closeTime: this.closeTime,
      templateName: this.state.templateName, open: this.state.open, close: this.state.close,
      type: this.state.type, include: this.state.include, format: this.state.format, selectedStoreIds: this.state.selectedStoreIds,
      createdDateTime: moment().format("YYYY-MM-DD HH:mm:ss a"),
      advancedOption: (!this.state.open || !this.state.close), longestTime: _.contains(this.state.include, "1"),systemStatistics: _.contains(this.state.include, "2"),
    });

    if(template[0].longestTime){
      this.state.reportData.longestTime = true
      this.setState(this.state)
    }else{
      this.state.reportData.longestTime = false
      this.setState(this.state)
      }
    if (template[0].systemStatistics) {
        this.state.reportData.systemStatistics = true
        this.setState(this.state)
    } else {
        this.state.reportData.systemStatistics = false
        this.setState(this.state)
    }




    this.state.templateData = template;
    this.setState(this.state);

    //validations
    if (this.state.toDate < this.state.fromDate) {
        this.state.errorMessage = t[language].daterangeinvalidbeyond ;
      this.setState(this.state);
    }

    if (this.state.selectedList.length == 0) {
        this.state.errorMessage = t[language].pleaseselectstore;
      this.setState(this.state);
      isError = true;
    }
        if (moment(this.state.toDate, "MM/DD/YYYY") < moment(this.state.fromDate, "MM/DD/YYYY")) {
            this.state.errorMessage = t[language].daterangeinvalidbeyond;
            this.setState(this.state);
            isError = true;
    }
    if (this.state.selectedStoreIds.length >= 250) {
        this.state.errorMessage = t[language].storeselectioninvalid250;
            this.setState(this.state);
            isError = true;
        }


    if (this.state.timeMeasure == 1) {
      if (
        moment(this.state.toDate, "MM/DD/YYYY").diff(
          moment(this.state.fromDate, "MM/DD/YYYY"),
              "days"
          ) > CommonConstants.TimeMeasureValidations.Month
      ) {
          this.state.errorMessage = t[language].daterangeinvalid1month;
        this.setState(this.state);
        isError = true;
      }
    }


    if (this.state.timeMeasure == 2) {
      if (
        moment(this.state.toDate, "MM/DD/YYYY").diff(
          moment(this.state.fromDate, "MM/DD/YYYY"),
              "days"
          ) > CommonConstants.TimeMeasureValidations.TwoWeeks
      ) {
          this.state.errorMessage = t[language].daterangeinvalid2week;
        this.setState(this.state);
        isError = true;
      }
    }

    if (this.state.timeMeasure == 3) {
      if (
        moment(this.state.toDate, "MM/DD/YYYY").diff(
          moment(this.state.fromDate, "MM/DD/YYYY"),
              "days"
          ) > CommonConstants.TimeMeasureValidations.TwoMonths
      ) {
          this.state.errorMessage = t[language].daterangeinvalid2month;
        this.setState(this.state);
        isError = true;
      }
    }
    if (this.state.timeMeasure == 4) {
      if (
        moment(this.state.toDate, "MM/DD/YYYY").diff(
          moment(this.state.fromDate, "MM/DD/YYYY"),
              "days"
          ) > CommonConstants.TimeMeasureValidations.Today
      ) {
          this.state.errorMessage = t[language].daterangeinvalidsingleday
        this.setState(this.state);
        isError = true;
        }
        if (this.state.selectedStoreIds.length > 1) {
            this.state.errorMessage = t[language].invalidselectiononestore
          this.setState(this.state);
          isError = true;
      }
    }

    if (this.state.templateName) {
        if (!this.state.saveAsTemplate) {
            this.state.errorMessage = t[language].pleasechecksaveastemplate
            this.setState(this.state)
            isError = true;
        }
    }
    if (this.state.saveAsTemplate) {
      if (!this.state.templateName) {
        this.state.errorMessage = t[language].pleaseneteratemplatename
        this.setState(this.state)
        isError = true;
      } else {
              let url = Config.apiBaseUrl + CommonConstants.apiUrls.createTemplate
              console.log(JSON.stringify(createTemplateData))

              this.api.postData(url, createTemplateData[0], data => {
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
      let templateData = this.state.templateData[0]
      let timeMeasure = this.state.templateData[0].timeMeasure.toString()
      switch (timeMeasure) {

        case '1' : this.state.reportData.dailyData = true
          if (templateData.selectedStoreIds.length === 1) {
            this.state.reportData.dayColumn = true
            this.state.reportData.groupStoreColumns = false
            this.state.reportData.singleStore = true
          } else {
            this.state.reportData.dayColumn = false
            this.state.reportData.groupStoreColumns = true
            this.state.reportData.singleStore = false
          }
          this.setState(this.state)
          this.generateDaypartReport()
          break

        case '2' : this.state.reportData.dayPartData = true
          if (templateData.selectedStoreIds.length === 1) {
            this.state.reportData.dayPartColumn = true
            this.state.reportData.groupStoreColumns = false
            this.state.reportData.singleStore = true
          } else {
            this.state.reportData.dayPartColumn = false
            this.state.reportData.groupStoreColumns = true
            this.state.reportData.singleStore = false
          }
          this.setState(this.state)
          this.generateDaypartReport()
          break

        case '3' : this.state.reportData.weeklyData = true
          if (templateData.selectedStoreIds.length === 1) {
            this.state.reportData.weekColumn = true
            this.state.reportData.groupStoreColumns = false
            this.state.reportData.singleStore = true
          } else {
            this.state.reportData.weekColumn = false
            this.state.reportData.groupStoreColumns = true
            this.state.reportData.singleStore = false
          }
          this.setState(this.state)
          this.generateDaypartReport()
          break

        case '4' : this.generateRawCarDataReport(template)
        //  this.props.history.push("/rawcardatareport",this.state.templateData);
          break
        }

    }
  }

  generateRawCarDataReport(template){
    let rawCarData = [];
    let selectedStoreIds = this.state.selectedStoreIds
    selectedStoreIds = selectedStoreIds.map(String);
    rawCarData.push(
        {
            "timeMeasure": parseInt(this.state.timeMeasure),
            "fromDate": this.state.fromDate,
            "toDate": this.state.toDate,
            "openTime": this.state.openTime,
            "closeTime": this.state.closeTime,
            "open": this.state.open,
            "close": this.state.close,
            "type": this.state.type,
            "include": this.state.include,
            "format": this.state.format,
            "selectedStoreIds": selectedStoreIds,
            "advancedOptions": template[0].advancedOptions,
            "longestTime": template[0].longestTime,
            "systemStatistics":template[0].systemStatistics
        }
    )
    this.setState({
        rawCarRequest: rawCarData[0]
    });
    let url = Config.apiBaseUrl + 'api/report/getRawCarDataReport?reportType=rr1'
    this.api.postData(url, rawCarData[0], data => {
      //  this.props.history.push("/rawcardatareport", this.state.rawCarData);
        this.props.history.push({
            pathname: '/rawcardatareport',
            state: { rawCarRequest: rawCarData[0] , rawCarData : data }
        })
    }, error => {
        this.state.successMessage = ''
        this.state.errorMessage = error.message
        this.setState(this.state)
    })
  }

  generateDaypartReport(){
    let template = this.state.templateData[0]
    this.state.reportData.generate = true
    let request = {
      "timeMeasure": parseInt(template.timeMeasure),
      "fromDate": moment(template.fromDate).format('YYYY-MM-DD'),
      "toDate": moment(template.toDate).format('YYYY-MM-DD'),
      "openTime": template.openTime,
      "closeTime": template.closeTime,
      "open": template.open,
      "close": template.close,
      "type": template.type,
      "include": template.include,
      "format": template.format,
      "selectedStoreIds": template.selectedStoreIds,
      "advancedOptions": template.advancedOptions,
      "longestTime": template.longestTime,
      "systemStatistics": template.systemStatistics,
  //    "recordPerPage": 4,
      "pageNumber": 1
    }
    console.log(JSON.stringify(request))
    let url = Config.apiBaseUrl + CommonConstants.apiUrls.generateReport + '?reportType=reports'
    this.api.postData(url, request, data => {
        console.log(JSON.stringify(data))
        this.props.history.push({
            pathname: '/summaryreport',
            state: { reportData: this.state.reportData , reportDataResponse : data, reportRequest: request }
        })
    }, error => {
        this.state.successMessage = ''
        this.state.errorMessage = error.message
        this.setState(this.state)
    })
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
            <span className={index == 0 ? "hidden" : ""}>,</span>
            {include == 1? "Longest Time": include == 2 ? "System Statistics" : ""}
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

      this.setState({ disableIncludes : true })
      this.setState({ include: [] });
      document.getElementById("longestTime").checked = false;
      document.getElementById("systemStatistics").checked = false;
    } else {
        this.setState({ disableIncludes: false })
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
