import React, { Component } from 'react'
import { I18n, Trans } from 'react-i18next'
import '../Security/Login.css'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Tree, { TreeNode } from 'rc-tree'
import Loader from '../Alerts/Loader'
import 'rc-tree/assets/index.css'
import '../../../node_modules/react-datetime/css/react-datetime.css'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import DateTimeField from 'react-datetime'
import DateTime from 'react-datetime'
import 'rc-time-picker/assets/index.css'
import moment from 'moment'

import TimePicker from 'rc-time-picker'
import SuccessAlert from '../Alerts/SuccessAlert'
import ErrorAlert from '../Alerts/ErrorAlert'
import {Config} from '../../Config'
import {CommonConstants} from '../../Constants'
import Api from '../../Api'
import ReactTooltip from 'react-tooltip'
import * as Enum from '../../Enums'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import AuthenticationService from '../Security/AuthenticationService'
import CommonLoader from '../Alerts/CommonLoader'
require('moment/locale/fr')


const ProductLogo = require('../../images/ProductLogo-1.png')
const HMELogo = require('../../images/HMELogo.png')
const Calendar = require('../../images/mini-cal.jpg')
const Asc = require('../../images/Arrow_red_asc.png')
const Desc = require('../../images/Arrow_red_desc.png')
const Delete = require('../../images/redEx.png')
const downArrow = require('../../images/arrow_back.jpg')
const _ = require('underscore')

class Report extends Component {
  handleValueChange = selectedTime => {
    this.setState({ selectedTime })
  }
  clear = () => {
    this.setState({
      selectedTime: undefined
    })
  }
  static propTypes = {
    keys: PropTypes.array
  }
  static defaultProps = {
    keys: ['0-0-0-0']
  }
  constructor(props) {
    super(props)
    const keys = props.keys
    this.state = {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
      mode: 'time'
    }
    this.state = {
      showLoader: false,
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
      fromDate: moment().format('MM/DD/YYYY'),
      toDate: moment().format('MM/DD/YYYY'),
      selectedOpenTime: null,
      selectedCloseTime: null,
      stores: [],
      tempStore: [],
      saveAsTemplate: false,
      templateName: null,
      savedTemplates: [],
      successMessage: null,
      ErrorMessage: null,
      timeMeasure: 1,
      checkStores: false,
      treeData: [],
      templateData : [],
      deviceUIds: [],
      disableIncludes:false,
      showStoresPopUp:false,
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
        systemStatistics: false,
        errors:[]
      },
      showCommonLoader: false
    }
    this.authService = new AuthenticationService(Config.authBaseUrl)
    this.api = new Api()
    this.getSavedReports()
    this.getTreeHierarchy()
  }

  getTreeHierarchy() {
      this.state.showCommonLoader = true
      this.setState(this.state)
      let url = Config.apiBaseUrl + CommonConstants.apiUrls.getGroupHierarchyTree
      if(this.authService.getUUID())
        url +='?uuId='+this.authService.getUUID()
      this.api.getData(url,data => {
        this.state.treeData = data.data
        this.state.showCommonLoader = false
        this.setState(this.state)
      })
  }
  valid(current){
    var today = moment().add( 1, 'day' )
        return !current.isAfter( today )
  }
  onCheck(checkedKeys, node) {
    this.state.selectedList = checkedKeys
    this.state.defaultCheckedKeys = checkedKeys
    this.state.stores = _.pluck(_.where(_.pluck(node.checkedNodes, 'props'), { type: CommonConstants.Type.Store }),'className')
    let deviceUIds = _.pluck(_.where(_.pluck(node.checkedNodes, 'props'), { type: CommonConstants.Type.Store }), 'value')
    this.state.deviceUIds = deviceUIds
    this.setState(this.state)

    if (deviceUIds.length > 1) {
        this.setState({ include: [] })
        document.getElementById('longestTime').checked = false
        document.getElementById('systemStatistics').checked = false
        this.setState({ disableIncludes: true })
    }
    else {
        this.setState({ disableIncludes: false })
    }
  }

  getInitialState() {
    var value = new Date().toISOString()
    return {
      value: value
    }
  }
  onSelect = (selectedKeys, info) => {

    this.selKey = info.node.props.eventKey
  }

  showFromDatePicker(){
    this.refs.fromDate.openCalendar()
  }

  showToDatePicker(){
    this.refs.toDate.openCalendar()
  }

  render() {
    const language = this.state.currentLanguage
    const { date, format, mode, inputFormat } = this.state
    //let level=0
    const loop = (data,level=0) => {
      
        return data.map(item => {
        if (item.Children && item.Children.length) {
          //level++
            return (
                <TreeNode title={this.renderStoresAndBrand(item,level) } className={item.StoreNumber} key={item.Id} value={item.Type === CommonConstants.Type.Store ? item.DeviceUID : null} type={item.Type}>
              {
                loop(item.Children,level+1)            
              }

            </TreeNode>
          )
        }
        return <TreeNode title={this.renderStoresAndBrand(item,level)} className={item.StoreNumber} key={item.Id} value={item.Type === CommonConstants.Type.Store ? item.DeviceUID : null} type={item.Type} />
      })
    }

    return (
    //  <I18n ns='translations'>
    //{
    //  (t, { i18n }) => (
      <section className='reportsPage'>
        <CommonLoader showLoader={this.state.showCommonLoader} message={'Loading...'}/>
        <Loader showLoader = {this.state.showLoader} />
        <div className={'reports ' + ((this.state.showLoader || this.state.showCommonLoader) ? 'hide' : 'show')}>
          <SuccessAlert successMessage={this.state.successMessage} />
          <ErrorAlert errorMessage={this.state.errorMessage} errors={this.state.errors} />
          <header className='reports-header'>{t[language].summaryReport}</header>
          {/* <Trans i18nKey='title'>
          </Trans> */}
          <form onSubmit={this.handleSubmit}>
            <section className='reports-pane-section'>
              <div className='reports-pane'>
                <div className='checkbox-sections-advanced'>
                  <div className='timings selectAllLabel'>
                    <input type='checkbox' id='includeTime'  checked={this.state.selectAll}
                      onChange={this.selectAll.bind(this)}/>
								<label className='label-heading' for='includeTime'>{t[language].selectall}</label>
                  </div>
                  <div className='timings BrandTitle'>
                    <span> {t[language].brand} </span>
                    <a data-tip={t[language].selectonestore}><span className='tip openTip'>?</span></a>
                    <ReactTooltip place='right' type='dark' effect='solid' />
                  </div>
                </div>

                <div className='saved-reports'>
                  <Tree
                    className='myCls'
                    showIcon={false}
                    showLine= {true}
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
                <span className='span-heading'>
                    <span> {t[language].timemeasure} </span>

                    <a data-tip={t[language].thereportwillsummarize}><span className='tip openTip'>?</span></a>
                    <ReactTooltip place='right' type='dark' effect='solid' />
                </span>
                <div className='cover-select'>
                  <img className='cover-select-image' src={downArrow} aria-hidden='true'/>
                  <select name='timeMeasure' className='time-measures' onChange={this.changeTimeMeasure.bind(this)}>
                                    <option selected={this.state.timeMeasure == 1} value='1'>{t[language].day}</option>
                                    <option selected={this.state.timeMeasure == 2} value='2'>{t[language].daypart}</option>
                                    <option selected={this.state.timeMeasure == 3} value='3'>{t[language].week}</option>
                                    <option selected={this.state.timeMeasure == 4} value='4'>{t[language].rawdatareport}</option>
                  </select>
                </div>
                <div class={'store-error ' + ((this.state.deviceUIds.length > 1 && this.state.timeMeasure == 4)?'show':'hide')} >
                    <p>{t[language].warningselect1stores}</p>
                </div>
                <div className='calendar-section'>
                  <div className='date-from'>
                    <span className='span-heading'>
                                        <span>  {t[language].from} </span>
                                        <a data-tip={t[language].choosestartandend}><span className='tip openTip'>?</span></a>
                                          <ReactTooltip place='right' type='dark' effect='solid' />
                    </span>
                    <div className='calendar'>
                      <div className='calendar-icon'>
                        <img src={Calendar} aria-hidden='true' onClick={this.showFromDatePicker.bind(this)}  />
                      </div>
                      <DateTimeField
                        locale={this.state.currentLanguage == 1? 'fr-ca' : 'en'}
                        className='date-time'
                        mode={date}
                        timeFormat={false}
                        inputProps={{ readOnly: true }}
                        closeOnSelect
                        ref='fromDate'
                        value={this.state.fromDate}
                        onChange={e => this.changeDate(e, 'from')}
                        isValidDate={ this.valid }
                      />
                    </div>
                  </div>
                  <div className='date-to'>
                    <span className='span-heading'>
                                        <span>  {t[language].to} </span>

                                        <a data-tip={t[language].choosestartandend}><span className='tip openTip'>?</span></a>
                      <ReactTooltip place='right' type='dark' effect='solid' />
                    </span>
                    <div className='calendar'>
                      <div className='calendar-icon'>
                        <img src={Calendar} aria-hidden='true' onClick={this.showToDatePicker.bind(this)} />
                      </div>
                      <DateTimeField
                        locale={this.state.currentLanguage == 1? 'fr-ca' : 'en'}
                        className='date-time'
                        mode={date}
                        timeFormat={false}
                        inputProps={{ readOnly: true }}
                        closeOnSelect
                        ref='toDate'
                        value={this.state.toDate}
                        onChange={e => this.changeDate(e, 'to')}
                        isValidDate={ this.valid }
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className={'advancedOptions '+ (!this.state.showAdvancedOptions? 'shortBorder':'')} onClick={this.showAdvanced.bind(this)}>
                    <span className='textPaddingSmall-reports'> {t[language].advancedoptions} </span>
                    <span className='showIcon'>
                          <img src={Asc} className={(this.state.showAdvancedOptions ? 'show' : 'hidden')} aria-hidden='true' />
                          <img src={Desc} className={(this.state.showAdvancedOptions ? 'hidden' : 'show')}  aria-hidden='true' />
                  </span>
                  </div>
                  <div
                    className={
                      'advanced-option-section ' +
                      (this.state.showAdvancedOptions ? 'show' : 'hidden')
                    }
                  >
                    <div className='checkbox-sections-advanced'>
                      <div className='timings'>
                        <TimePicker
                          defaultValue={this.state.openTime}
                          onChange={this.handleValueChange}
                          showSecond={false}
                          use12Hours={true}
                          disabled={this.state.open}
                          onChange={this.timeChange.bind(this, 'openTime')}
                          name='open'
                          value={this.state.openTime}
                        />
                      </div>
                      <div className='timings'>
                        <TimePicker
                          defaultValue={this.state.closeTime}
                          onChange={this.handleValueChange}
                          showSecond={false}
                          use12Hours={true}
                          disabled={this.state.close}
                          onChange={this.timeChange.bind(this, 'closeTime')}
                          name='close'
                          value={this.state.closeTime}
                        />
                      </div>
                    </div>

                    <div className='checkbox-sections-advanced'>
                      <div className='alignCenter timings'>
                      <input type='checkbox' id='open'   name='open'  checked={this.state.open}
                              onChange={this.check.bind(this, this.state.open)}/>
								<label className='label-heading' for='open'> {t[language].open}</label>
                                   <span> <a className='inline-block'  data-tip={t[language].leavetheopencloseboxes}><span className='tip openTip'>?</span></a>
                          <ReactTooltip place='right' type='dark' effect='solid' /> </span>
                      </div>
                      <div className='timings'>
                       <input type='checkbox' id='close'   name='close'   checked={this.state.close}
                          onChange={this.check.bind(this, this.state.close)}/>
								<label className='label-heading' for='close'>  {t[language].close}</label>
                         <span>
                          <a className='inline-block'  data-tip={t[language].leavetheopencloseboxes}><span className='tip openTip'>?</span></a>
                          <ReactTooltip place='right' type='dark' effect='solid' />
                        </span>
                      </div>
                    </div>
                    <span>{t[language].type}</span>
                    <div className='checkbox-sections'>
                      <div className='type-sub-section'>
                       
                         <input type='radio' id='type1'   name='type'     checked={this.state.type == 1 ? true : false}
                          onChange={this.handleOnChange.bind(this)} value={1}/>
								<label className='label-heading' for='type1'>   {t[language].timeslice}</label>                     
                                 <span>
                                                  <a className='inline-block' data-tip={t[language].choosetimeslice}><span className='tip openTip'>?</span></a>
                          <ReactTooltip place='right' type='dark' effect='solid' />
                        </span>
                      </div>
                      <div className='type-sub-section'>
                         <input type='radio' id='type2'   name='type'   checked={this.state.type == 2 ? true : false} onChange={this.handleOnChange.bind(this)} value={2}/>
								<label className='label-heading' for='type2'>   {t[language].cumulative}</label>     
                                            <span>
                          <a className='inline-block' data-tip={t[language].choosecumulative}><span className='tip openTip'>?</span></a>
                          <ReactTooltip place='right' type='dark' effect='solid' />
                        </span>
                      </div>
                    </div>
                    <span className='note'>{t[language].reportsadvancedreport} </span>
                  </div>
                </div>
                <div className='includeCriteria'>{t[language].include} </div>
                <div className='checkbox-sections'>
                          <div className='alignCenter'>
                                    <input type='checkbox' id='longestTime' disabled={this.state.showAdvancedOptions || this.state.disableIncludes} value={1} onChange={this.include.bind(this)}/>
                                    <label className='label-heading' for='longestTime'>   {t[language].longesttimes}</label>     
                                   </div>
                                  <div className='alignCenter'>
                                    <input
                                          type='checkbox'
                                        id='systemStatistics'
                                        disabled={this.state.showAdvancedOptions || this.state.disableIncludes}
                                          value={2}
                                          onChange={this.include.bind(this)}
                                      />
                                              <label className='label-heading' for='systemStatistics'>   {t[language].systemstats}</label>   
                                  </div>
                                 </div>
                <span className='span-heading'>
                                <span> {t[language].format}  </span>

                                <a data-tip={t[language].chooseseconds}><span className='tip openTip'>?</span></a>
                                  <ReactTooltip place='right' type='dark' effect='solid' />
                </span>
                <div className='checkbox-sections'>
                                  <div className='alignCenter'>
                                    <input
                                          type='radio'
                                          id='format1'
                                          name='format'
                                          checked={this.state.format == 1 ? true : false}
                                          onChange={this.handleOnChange.bind(this)}
                                          value={1}
                                      />
                                    	<label className='label-heading' for='format1'>   {t[language].secondswformat}</label>  
                                  </div>
                                  <div className='alignCenter'>
                                    <input
                                          type='radio'
                                          id='format2'
                                          name='format'
                                          checked={this.state.format == 2 ? true : false}
                                          onChange={this.handleOnChange.bind(this)}
                                          value={2}
                                      />
                                    <label className='label-heading' for='format2'>   {t[language].minuteswformat}</label>  
                                  </div>
                </div>
              </div>
              <div className='reports-pane'>
                <span className='span-heading'>
                                <span>  {t[language].savedreporttemplates}  </span>
                                <a data-tip={t[language].selectapreviousreport}><span className='tip openTip'>?</span></a>
                  <ReactTooltip place='right' type='dark' effect='solid' />
                </span>
                <div className='saved-reports'>{this.savedReports()}</div>
                <span>{t[language].criteria} </span>
                <div className='container criteria'>
                  <div className='col-md-12 storeWrap'>

                                    <span className='criteriaHeading'>{t[language].stores} :</span>
                                    {this.state.stores.length ? (this.renderStores()) : <span className='selectAStore'>{t[language].SelectAStore}</span>}

                                    {
                                       this.state.stores.length>3 ? this.renderDots() : '' 
                                    }
                  </div>
                  <div className='col-md-6'> <span className='criteriaHeading'>{t[language].from} :</span>{this.state.fromDate} </div>
                  <div className='col-md-6'> <span className='criteriaHeading'>{t[language].to} :</span>{this.state.toDate}</div>
                  <div className='col-md-12'>
                      <span className='criteriaHeading'>{t[language].timemeasure} :</span>{parseInt(this.state.timeMeasure) === CommonConstants.TimeMeasure.Day
                       ? t[language].day
                      : parseInt(this.state.timeMeasure) === CommonConstants.TimeMeasure.Daypart
                                            ? t[language].daypart
                                            : parseInt(this.state.timeMeasure) === CommonConstants.TimeMeasure.Week
                                                ? t[language].week
                                                : parseInt(this.state.timeMeasure) === CommonConstants.TimeMeasure.RawCarData
                                                    ? t[language].rawdatareport
                            : ''}
                  </div>
                  <div className='col-md-12'>
                      <span className='criteriaHeading'>{t[language].include} :</span>{this.state.include.length ? this.renderInclude() : 'None'}
                  </div>
                  <div className='col-md-12'>
                                    <span className='criteriaHeading'>{t[language].format}  :</span>
                                    {this.state.format == 1? t[language].secondswformat: this.state.format == 2 ? t[language].minuteswformat : ''}
                  </div>
                </div>
                <div className='alignCenter'>
                  <input
                    name='saveAsTemplate'
                    type='checkbox'
                    value={this.state.saveAsTemplate}
                    onChange={this.check.bind(this, this.state.saveAsTemplate)}
                  />
                  <span className='textPaddingLarge'> {t[language].saveastemplate}  </span>
                </div>
                <div>
                  <input name='templateName' className='save-template' placeholder={t[language].namethistemplate} value={this.state.templateName}
                    onChange={this.handleOnChange.bind(this)} maxLength={25}/>
                </div>
                <div type='submit' className='generate-reports' onClick={this.generate.bind(this)}>
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
    )
  }

  timeChange(name, e) {
    let self = this
     if(e === null){
       self.setState({
         [name]: ''
       })
     }else{
      self.setState({
        [name]: moment(e, 'HH:mm A')
      })
     }
   
  }

  handleOnChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  check(value, e) {
    if (!value) {
      this.setState({
        [e.target.name]: !value
      })
    }
    this.setState({
      [e.target.name]: !value
    })
  }
  handleFormSubmit(e) {
    e.preventDefault()
  }

  showAdvanced(e) {
    let showAdvancedOptions = this.state.showAdvancedOptions
    if (!showAdvancedOptions) {
      this.setState({ include: [] })
    }
    document.getElementById('longestTime').checked = false
    document.getElementById('systemStatistics').checked = false
    this.setState({
      showAdvancedOptions: !showAdvancedOptions
    })
  }

  getSavedReports() {
      let url = Config.apiBaseUrl + CommonConstants.apiUrls.getSavedTemplates
      this.api.getData(url, data => {
          this.state.savedTemplates = []
          this.setState({
          savedTemplates: data.data
        })
      }, error => {
        console.log(error)
      })
  }

 savedReports() {
  let savedTemplates = this.state.savedTemplates
  if (savedTemplates) {
      let renderSavedTemplates = savedTemplates.map((report, index) => {
        return (
          <div className='templateRow' key={index} title={report.templateName}>
                <div className={'col-md-10 savedName ' +(index % 2 === 0 ? 'even' : 'odd')} id={report.id} onClick={this.apply.bind(this)}>
                   {report.templateName}
                </div>
            <div className={'col-md-2 delete-icon ' +(index % 2 === 0 ? 'even' : 'odd')} id={report.id} onClick={this.delete.bind(this)}>
              <span id={report.id}>
                <img className='logOutIcon' id={report.id} src={Delete} aria-hidden='true'/>
              </span>
            </div>
          </div>
        )
      })
      return renderSavedTemplates
    }
  }

  renderTimeMeasures() {
    let timeMeasures =
      this.state.timeMeasures &&
      this.state.timeMeasures.map(function(timeMeasure, index) {
        return <option value={timeMeasure.Id}>{timeMeasure.Type}</option>
      })
    return timeMeasures
  }

  changeTimeMeasure(e) {
    const { name, value } = e.target
    this.setState({
      timeMeasure: value
    })
  }

  findMatch(list, keys) {
    let selectedItems = []
    let selectedList = []
    let findStore = function(items) {
      items.map(item => {
        if (item.Children && item.Children.length) {
          findStore(item.Children)
        }
        if (keys(item)) {
          selectedItems.push(item.Name)
          selectedList.push(item.Id)
        }
      })
    }

  findStore(list)
    this.setState({
      selectedList: selectedList
    })
    return selectedItems
  }

  findMatchedClassName(list, keys) {
      let selectedItems = []
      let selectedList = []
      let findStore = function (items) {
          items.map(item => {
              if (item.Children && item.Children.length) {
                  findStore(item.Children)
              }
              if (keys(item)) {
                  selectedItems.push(item.StoreNumber)
                  selectedList.push(item.Id)
              }
          })
      }

      findStore(list)
      this.setState({
          selectedList: selectedList
      })
      return selectedItems
  }


  findMatchedIds(list, keys) {
    let selectedList = []
    let findStore = function(items) {
      items.map(item => {
        if (item.Children && item.Children.length) {
          findStore(item.Children)
        }
        if (keys(item)) {
          selectedList.push(item.Id)
        }
      })
    }

    findStore(list)
    return selectedList
  }

  findMatchedDeviceIds(list, keys) {
      let selectedList = []
      let findStore = function (items) {
          items.map(item => {
              if (item.Children && item.Children.length) {
                  findStore(item.Children)
              }
              if (keys(item)) {
                  selectedList.push(item.DeviceId)
              }
          })
      }

      findStore(list)
      return selectedList
  }

  findMatchedDeviceUIds(list, keys) {
    let selectedList = []
    let findStore = function (items) {
        items.map(item => {
            if (item.Children && item.Children.length) {
                findStore(item.Children)
            }
            if (keys(item)) {
                selectedList.push(item.DeviceUID)
            }
        })
    }

    findStore(list)
    return selectedList
  }

  apply(e) {

      let url = Config.apiBaseUrl + CommonConstants.apiUrls.getSavedTemplateData + '?templetId=' +
    e.target.id
    this.api.getData (url,data => {
        let template = data.data
        this.setState({ format: template.Format, type: template.Type, open: template.Open, close: template.Close, timeMeasure: template.TimeMeasure})
        let fromDate = moment(template.FromDate).format('MM/DD/YYYY')
        this.setState({ fromDate: fromDate })
        let toDate = moment(template.ToDate).format('MM/DD/YYYY')
        this.setState({ toDate: toDate })
        this.state.defaultCheckedKeys =  this.findMatchedIds(this.state.treeData, item => {
          return item.Type === CommonConstants.Type.Store && _.contains(template.DeviceUUIds, item.DeviceUID)
        }).map(String)
        this.setState(this.state)
        this.setState({
          stores: this.findMatchedClassName(this.state.treeData, item => {
            return (
              item.Type === CommonConstants.Type.Store &&
              template.DeviceUUIds.indexOf(item.DeviceUID.toString()) > -1
            )
          })
        })
        this.setState({
         deviceUIds :  template.DeviceUUIds
       })
        let include = []
        if(template.LongestTime){
          document.getElementById('longestTime').checked = true
          include.push('1')
        }
        else{
          document.getElementById('longestTime').checked = false
        }
        if(template.SystemStatistics){
          document.getElementById('systemStatistics').checked = true
          include.push('2')
        }
        else{
          document.getElementById('systemStatistics').checked = false
        }
        this.setState({ include: include })
        if (template.Open == false) {
          this.state.openTime = moment(template.OpenTime, 'HH:mm a')
          this.setState(this.state)
        }
        if (template.Close == false) {
          this.state.closeTime = moment(template.CloseTime, 'HH:mm a')
          this.setState(this.state)
        }
      }, error => {
        console.log(error)
      })
    }

  delete (e) {
      let url = Config.apiBaseUrl + CommonConstants.apiUrls.deleteTemplate + '?templateId=' +
      e.target.id
    this.api.deleteData (url,data => {
      this.getSavedReports()
    }, error => {
    })
  }

  generate(e) {
    let language = this.state.currentLanguage
    this.state.reportData.generate = true
    let self = this
    this.setState({ errorMessage: '' })
    let isError = false
    let template = []
    let createTemplateData = []
    this.openTime = moment(this.state.openTime).format('hh:mm a')
    this.closeTime = moment(this.state.closeTime).format('hh:mm a')
    if(this.openTime === 'Invalid date'){
     this.openTime = ''
    }else{
     this.openTime = moment(this.state.openTime).format('hh:mm a')
    }
    if(this.closeTime === 'Invalid date'){
       this.closeTime = ''
    }else{
      this.closeTime = moment(this.state.closeTime).format('hh:mm a')
    }
    template.push({
      selectedList: this.state.selectedList,timeMeasure: this.state.timeMeasure,fromDate: this.state.fromDate,toDate: this.state.toDate,
      openTime: this.openTime,closeTime: this.closeTime,
      templateName: this.state.templateName, open: this.state.open, close: this.state.close,
      type: this.state.type, include: this.state.include, format: this.state.format, deviceUIds: this.state.deviceUIds,
      deviceIds: this.findMatchedDeviceIds(this.state.treeData, item => {
          return (item.Type === CommonConstants.Type.Store && _.contains(self.state.deviceUIds, item.DeviceUID))
      }), 
      CreatedDateTime: moment().format('YYYY-MM-DD HH:mm:ss a'), UpdatedDateTime: moment().format('YYYY-MM-DD HH:mm:ss a'),
      advancedOption: (!this.state.open || !this.state.close), longestTime: _.contains(this.state.include, '1'),systemStatistics: _.contains(this.state.include, '2'),
    })

    createTemplateData.push({
      timeMeasure: this.state.timeMeasure,fromDate: this.state.fromDate,toDate: this.state.toDate,
      openTime: this.openTime,closeTime: this.closeTime,
      templateName: this.state.templateName, open: this.state.open, close: this.state.close,
      type: this.state.type, format: this.state.format, deviceUUIds: this.state.deviceUIds,
      createdDateTime: moment().format('YYYY-MM-DD HH:mm:ss a'),
      advancedOption: (!this.state.open || !this.state.close), longestTime: _.contains(this.state.include, '1'),systemStatistics: _.contains(this.state.include, '2'),
    })

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
    this.state.templateData = template
    this.setState(this.state)
    let errors = []
    if (this.state.selectedList.length == 0) {
      errors.push(t[language].pleaseselectstore)
      isError = true
    }

    if (!this.state.open && !this.openTime ) {
      errors.push(t[language].pleaseselectopentime)
      isError = true
    }

    if (!this.state.close && !this.closeTime ) {      
      errors.push(t[language].pleaseselectclosetime)
      isError = true
    }
    if (moment(this.state.toDate, 'MM/DD/YYYY') < moment(this.state.fromDate, 'MM/DD/YYYY')) {
          errors.push(t[language].daterangeinvalidbeyond)  
          isError = true
    }
    if (this.state.deviceUIds.length > 250 && template[0].advancedOption) {
      errors.push(t[language].storeselectioninvalid250)  
            isError = true
    }
    if (this.state.deviceUIds.length > 100 && !template[0].advancedOption) {
          errors.push(t[language].storeselectioninvalid100)  
                isError = true
    }
    if (this.state.deviceUIds.length > 1 && this.state.timeMeasure == 4) {
      errors.push(t[language].invalidselectiononestore)  
            isError = true
    }


        if (parseInt(this.state.timeMeasure) === CommonConstants.TimeMeasure.Day) {
          if(!this.state.open || !this.state.close) {
            if(template[0].deviceIds.length > 100) {
              if( moment(this.state.toDate, 'MM/DD/YYYY').diff(
                moment(this.state.fromDate, 'MM/DD/YYYY'),
                    'days'
                ) > CommonConstants.TimeMeasureValidations.Month){
                  errors.push(t[language].daterangeinvalid1month)  
                  isError = true
              }
            } else {
              if( moment(this.state.toDate, 'MM/DD/YYYY').diff(
                moment(this.state.fromDate, 'MM/DD/YYYY'),
                    'days'
                ) > CommonConstants.TimeMeasureValidations.ThreeMonths){
                  errors.push(t[language].daterangeinvalid3month) 
                  isError = true
                }
            }
          } else {
            if (
              moment(this.state.toDate, 'MM/DD/YYYY').diff(
                moment(this.state.fromDate, 'MM/DD/YYYY'),
                    'days'
                ) > CommonConstants.TimeMeasureValidations.Month
            ) {
              errors.push(t[language].daterangeinvalid1month)  
              isError = true
            }
          }
        }
        if (parseInt(this.state.timeMeasure) === CommonConstants.TimeMeasure.Daypart) {
          if(!this.state.open || !this.state.close) {
            if(template[0].deviceIds.length > 100) {
              if (
                moment(this.state.toDate, 'MM/DD/YYYY').diff(
                  moment(this.state.fromDate, 'MM/DD/YYYY'),
                      'days'
                  ) > CommonConstants.TimeMeasureValidations.TwoWeeks
              ) {
                errors.push(t[language].daterangeinvalid2week)
                isError = true
              }
             
            } else {
              if( moment(this.state.toDate, 'MM/DD/YYYY').diff(
                moment(this.state.fromDate, 'MM/DD/YYYY'),
                    'days'
                ) > CommonConstants.TimeMeasureValidations.ThreeMonths){
                  errors.push(t[language].daterangeinvalid3month)
                  isError = true
                }
            }
          }else{
            if (
              moment(this.state.toDate, 'MM/DD/YYYY').diff(
                moment(this.state.fromDate, 'MM/DD/YYYY'),
                    'days'
                ) > CommonConstants.TimeMeasureValidations.TwoWeeks
            ) {
              errors.push(t[language].daterangeinvalid2week)
              isError = true
            }
          }
        }
    
        if (parseInt(this.state.timeMeasure) === CommonConstants.TimeMeasure.Week) {
          if(!this.state.open || !this.state.close) {
            if(template[0].deviceIds.length > 100) {
              if (
                moment(this.state.toDate, 'MM/DD/YYYY').diff(
                  moment(this.state.fromDate, 'MM/DD/YYYY'),
                      'days'
                  ) > CommonConstants.TimeMeasureValidations.TwoMonths
              ) {
                
              errors.push(t[language].daterangeinvalid2month)
                isError = true
              }
             
            } else {
              if( moment(this.state.toDate, 'MM/DD/YYYY').diff(
                moment(this.state.fromDate, 'MM/DD/YYYY'),
                    'days'
                ) > CommonConstants.TimeMeasureValidations.ThreeMonths){
                  
                  errors.push(t[language].daterangeinvalid3month)
                  isError = true
                }
            }
          }else{
            if (
              moment(this.state.toDate, 'MM/DD/YYYY').diff(
                moment(this.state.fromDate, 'MM/DD/YYYY'),
                    'days'
                ) > CommonConstants.TimeMeasureValidations.TwoMonths
            ) {              
              errors.push(t[language].daterangeinvalid2month)
              isError = true
            }
          }
    
        }

        if (parseInt(this.state.timeMeasure) === CommonConstants.TimeMeasure.RawCarData) {
              if (
                moment(this.state.toDate, 'MM/DD/YYYY').diff(
                  moment(this.state.fromDate, 'MM/DD/YYYY'),
                      'days'
                  ) > CommonConstants.TimeMeasureValidations.ThreeMonths
              ) {
                errors.push(t[language].daterangeinvalid3month)
                isError = true
              }             
            }

    if (this.state.templateName) {
        if (!this.state.saveAsTemplate) {
            errors.push(t[language].pleasechecksaveastemplate)
            isError = true
        }
    }
    if (this.state.saveAsTemplate) {
      if (!this.state.templateName || this.state.templateName.trim().length == 0) {
        errors.push(t[language].pleaseneteratemplatename)
        isError = true
      } else {
        let sameTemplate= false
        this.state.savedTemplates.map((template) => {
          if(template.templateName === this.state.templateName){
            sameTemplate = true
          }
        })
        if(sameTemplate){
          errors.push(t[language].pleaseenterauniquetemplate)
          isError = true
        }else{
          isError = false
          let url = Config.apiBaseUrl + CommonConstants.apiUrls.createTemplate

          this.api.postData(url, createTemplateData[0], data => {
              this.state.successMessage = data.data
              this.state.errorMessage = ''
              this.setState(this.state)
              this.getSavedReports()
          }, error => {
              errors.push('ERROR')
              this.state.errorMessage = 'ERROR'
              this.state.successMessage = ''
              this.setState(this.state)
          })
        }
      }
    }
    if (!isError) {
      let templateData = this.state.templateData[0]
      let timeMeasure = this.state.templateData[0].timeMeasure.toString()
      switch (timeMeasure) {

        case '1' : this.state.reportData.dailyData = true
          if (templateData.deviceUIds.length === 1) {
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
          if (templateData.deviceUIds.length === 1) {
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
          if (templateData.deviceUIds.length === 1) {
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
          break
        }
      }
    else{
    this.setState({errors: errors})
    }
  }

  generateRawCarDataReport(template) {
    let language = this.state.currentLanguage
    this.state.showLoader = true
    this.setState(this.state)
    let rawCarData = []
    rawCarData.push(
        {
            'timeMeasure': parseInt(this.state.timeMeasure),
            'fromDate': moment(this.state.fromDate).format('YYYY-MM-DD'),
            'toDate': moment(this.state.toDate).format('YYYY-MM-DD'),
            'openTime': template[0].openTime,
            'closeTime': template[0].closeTime,
            'open': this.state.open,
            'close': this.state.close,
            'type': this.state.type,
            'include': this.state.include,
            'format': this.state.format,
            'deviceIds': template[0].deviceIds,
            'advancedOption': template[0].advancedOption,
            'longestTime': template[0].longestTime,
            'systemStatistics':template[0].systemStatistics
        }
    )
    this.setState({
        rawCarRequest: rawCarData[0]
    })
    let url = Config.apiBaseUrl + CommonConstants.apiUrls.generateNewReport + '?reportType=reports'
    this.api.postData(url, rawCarData[0], data => {
      if (data.status) {
        this.state.showLoader = false
        this.setState(this.state)
        this.props.history.push({
            pathname: '/rawcardatareport',
            state: { rawCarRequest: rawCarData[0] , rawCarData : data, reportData: this.state.reportData }
        })
      }else {
        if(data.data.code === 'ETIMEOUT') {
          this.state.showLoader = false
          this.state.successMessage = ''
          this.state.errorMessage = t[language].errorTimeout
          this.setState(this.state)
        } else {
          this.state.showLoader = false
          this.state.successMessage = ''
          this.state.errorMessage = t[language][data.key]
          this.setState(this.state)
        }
      }
    }, error => {
        this.state.successMessage = ''
        this.state.errorMessage = error.message
        this.setState(this.state)
    })
  }

  generateDaypartReport(){
    let language = this.state.currentLanguage
    this.state.showLoader = true
    this.setState(this.state)
    let template = this.state.templateData[0]
    this.state.reportData.generate = true
    let request = {
      'timeMeasure': parseInt(template.timeMeasure),
      'fromDate': moment(template.fromDate).format('YYYY-MM-DD'),
      'toDate': moment(template.toDate).format('YYYY-MM-DD'),
      'openTime': template.openTime,
      'closeTime': template.closeTime,
      'open': template.open,
      'close': template.close,
      'type': template.type,
      'include': template.include,
      'format': parseInt(template.format),
      'deviceIds':template.deviceIds,
      'advancedOption': template.advancedOption,
      'longestTime': template.longestTime,
      'systemStatistics': template.systemStatistics,
      'pageNumber': 1
    }
    if(request.advancedOption){
      let url
      let type = 'PDF'
        if (type == 'CSV')
        {
            url = Config.apiBaseUrl + CommonConstants.apiUrls.generateNewReport + '?reportType=csv'
        }
        if (type == 'PDF') {
           url = Config.apiBaseUrl + CommonConstants.apiUrls.generateNewReport + '?reportType=pdf'
        }
        if (this.state.reportData.singleStore) {
          request.localTime = moment(new Date()).format('hh:mm A')
        } else {
          request.localTime = moment(new Date()).locale('en').format('MMM D,YYYY hh:mm A')
        }
        // request.localTime = moment(new Date()).locale('en').format('MMM D,YYYY hh:mm')
        this.setState({ showLoader: true })
        this.api.postData(url, request, data => {
            if (data.status) {
                this.state.errorMessage = ''
                this.setState(this.state)
                this.setState({ showLoader: false })
                this.props.history.push('/emailSent', data.data)
            } else {
              if(data.data.code === 'ETIMEOUT') {
                this.state.showLoader = false
                this.state.successMessage = ''
                this.state.errorMessage = t[language].errorTimeout
                this.setState(this.state)
              } else {
                this.state.showLoader = false
                this.state.successMessage = ''
                this.state.errorMessage = t[language][data.key]
                this.setState(this.state)
              }
            }
        }, error => {
            this.state.successMessage = ''
            this.state.errorMessage = 'Failed sending Email'
            this.setState(this.state)
        })
    }else{
     let url = Config.apiBaseUrl + CommonConstants.apiUrls.generateNewReport + '?reportType=reports'
      this.api.postData(url, request, data => {
        if (data.status) {
          this.state.showLoader = false
          this.setState(this.state)
          this.props.history.push({
              pathname: '/summaryreport',
              state: { reportData: this.state.reportData , reportDataResponse : data, reportRequest: request }
          })
        } else {
          if(data.data.code === 'ETIMEOUT') {
            this.state.showLoader = false
            this.state.successMessage = ''
            this.state.errorMessage = t[language].errorTimeout
            this.setState(this.state)
          } else {
            this.state.showLoader = false
            this.state.successMessage = ''
            this.state.errorMessage = t[language][data.key]
            this.setState(this.state)
          }
         
        }
      }, error => {
          this.state.successMessage = ''
          this.state.errorMessage = error.message
          this.setState(this.state)
      })
    }
  }

  changeDate(date, dateSelection) {
    let selectedDate = moment(date, 'MM/DD/YYYY').format('MM/DD/YYYY')
    if (dateSelection == 'from') {
      this.setState({
        fromDate: selectedDate
      })
    } else if (dateSelection == 'to') {
      this.setState({
        toDate: selectedDate
      })
    }
  }

  include(e) {
    let include = this.state.include
    if (_.contains(include, e.target.value)) {
      include = _.filter(include, function(value) {
        return value !== e.target.value
      })
    } else {
      include.push(e.target.value)
    }
    this.setState({
      include: include
    })
  }

  renderInclude(e) {
    const language = this.state.currentLanguage
    let include = this.state.include
    let renderInclude
    if (include) {
      renderInclude = include.map(function(include, index) {
        return (
          <span key={index}>
            <span className={index == 0 ? 'hidden' : ''}>,</span>
            {include == 1? t[language].longesttimes: include == 2 ? t[language].systemstats : ''}
          </span>
        )
      })
    } else {
      renderInclude = include.map(function(include, index) {
        return <span>None</span>
      })
    }
    return renderInclude
  }

  renderStores() {
    let renderStores
    let stores = this.state.stores
    renderStores = stores.map(function(store, index) {
      return (
        <span key={index} className={index > 2 ? 'hidden' : ''}>
          <span className={index == 0 ? 'hidden' : ''}>,</span> {store}
        </span>
      )
    })
    return renderStores
  }

  renderStoresPopup() {
    let renderStores
    let stores = this.state.stores
    renderStores = stores.map(function(store, index) {
      return (
        <span key={index}>
          <span className={index == 0 ? 'hidden' : ''}>,</span> {store}
        </span>
      )
    })
    return renderStores
  }

  renderDots(){
        return(
          <span className='storesDots' onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()}>...
          <div className={'storesTooltip '+ (!this.state.showStoresPopUp?'hidden':'')}> {this.renderStoresPopup()} </div>  
          </span>
        )
  }

  mouseOut() {
    this.setState({showStoresPopUp: false})
  }
  
  mouseOver() {
    this.setState({showStoresPopUp: true})
  }

  render

  selectAll(e) {
    if (!this.state.selectAll) {
      this.setState({
        defaultCheckedKeys: _.pluck(this.state.treeData, 'Id').map(String),
        stores: this.findMatchedClassName(this.state.treeData, item => {
          return item.Type === CommonConstants.Type.Store
        }),

        selectedList: this.findMatchedIds(this.state.treeData, item => {
          return true
        }),
        deviceUIds: this.findMatchedDeviceUIds(this.state.treeData, item => {
          return item.Type === CommonConstants.Type.Store
        })
        })

      this.setState({ disableIncludes : true })
      this.setState({ include: [] })
      document.getElementById('longestTime').checked = false
      document.getElementById('systemStatistics').checked = false
    } else {
        this.setState({ disableIncludes: false })
      this.setState({ defaultCheckedKeys: [],
                      selectedList:[],
                      stores:[]
       })
    }
    this.setState({
      selectAll: !this.state.selectAll
    })
  }
  renderStoresAndBrand(item,level) {
          return (<div className={'storeTree level-'+level}><span className={'StoreTitile level-'+level} >{item.Name ? (item.StoreNumber ? item.StoreNumber + '-' : '') + item.Name : item.StoreNumber ? item.StoreNumber : ''}</span> <span className='StoreBrand'>{item.Brand ? item.Brand : ''}</span> </div>)
  }
}

export default Report
