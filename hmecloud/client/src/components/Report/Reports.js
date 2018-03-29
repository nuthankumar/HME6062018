import React, { Component } from 'react';
import '../Security/Login.css';
import AuthService from '../Security/AuthenticationService';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Tree, { TreeNode } from 'rc-tree';
import 'rc-tree/assets/index.css';
import "../../../node_modules/react-datetime/css/react-datetime.css";

import DateTimeField from 'react-datetime';
import DateTime from 'react-datetime';
//import './basic.less';  

import 'rc-time-picker/assets/index.css';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import HmeHeader from '../Header/HmeHeader'
import fetch from 'isomorphic-fetch';
import SuccessAlert from "../Alerts/SuccessAlert"
import ErrorAlert from "../Alerts/ErrorAlert"

const ProductLogo = require('../../images/ProductLogo-1.png');
const HMELogo = require('../../images/HMELogo.png');
const Calendar = require('../../images/mini-cal.jpg');

const Delete = require('../../images/redEx.png');
const _ = require('underscore');


class Login extends Component {
 


    state = {
        selectedTime: moment(),
    };
    handleValueChange = (selectedTime) => {
        this.setState({ selectedTime });
    }
    clear = () => {
        this.setState({
            selectedTime: undefined,
        });
    }

    static propTypes = {
        keys: PropTypes.array,
    };
    static defaultProps = {
        keys: ['0-0-0-0'],
    };
    constructor(props) {



        super(props);
        const keys = props.keys;
        this.state = {
      
            defaultCheckedKeys: keys,
            switchIt: true,
            date: "1990-06-05",
            format: "YYYY-MM-DD",
            inputFormat: "DD/MM/YYYY",
            mode: "time",

        };
        this.state = {
            showAdvancedOptions: false,
            open: true,
            close: true,
            include:[],
            format:2,
            type: 2,
            fromDate: moment().format('MM/DD/YYYY'),
            toDate: moment().format('MM/DD/YYYY'),
            //openTime: null,
            //closeTime: null,
            stores:[],
            saveAsTemplate:false,  
            templateName: null,  
            savedTemplates: null,
            successMessage: null,
            ErrorMessage: null,
            timeMeasure: 1,
            treeData: [
                {
                    id: 1,
                    name: "group1",
                    children: [
                        {
                            id: 11,
                            name: "Group2",
                            children: [
                                {
                                    id: 111,
                                    name: "store1"
                                }, {
                                    id: 112,
                                    name: "store2"
                                }
                            ]
                        },
                        {
                            id: 12,
                            name: "store3",
                            children: []
                        }
                    ]
                }, {
                    id: 2,
                    name: "group3",
                    children: [
                        {
                            id: 21,
                            name: "store4",
                            children: []
                        }
                    ]
                }, {
                    id: 3,
                    name: "group4",
                  //  type:'group',
                    children: [
                        {
                            id: 31,
                            name: "group5",
                            children: [
                                {
                                    id: 311,
                                    name: "store6",
                                    children: []
                                }, {
                                    id: 312,
                                    name: "store7",
                                    children: []
                                }
                            ]
                        }
                    ]
                }
            ]}

        this.getSavedReports();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.Auth = new AuthService();
        // timeMeasures = []
    }

    componentWillMount() {
        if (this.Auth.loggedIn())
            this.props.history.replace('/');
    }

    onExpand(expandedKeys) {
        console.log('onExpand', expandedKeys, arguments);
    }
    onSelect(selectedKeys, info) {
        console.log('selected', selectedKeys, info);
        this.selKey = info.node.props.eventKey;
    }
    onCheck(checkedKeys, info) {
        console.log('onCheck', checkedKeys, info);
    }

    loadData(e) {
        console.log('loaddata');
    }
    onEdit() {
        setTimeout(() => {
            console.log('current key: ', this.selKey);
        }, 0);
    }
    onDel(e) {
        if (!window.confirm('sure to delete?')) {
            return;
        }
        e.stopPropagation();
    }

    getInitialState() {
        var value = new Date().toISOString();
        return {
            value: value
        }
    }
    handleChange(value, formattedValue) {
        this.setState({
            value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z" 
            formattedValue: formattedValue // Formatted String, ex: "11/19/2016" 
        });
    }


   




    render() {
        const { date, format, mode, inputFormat } = this.state;
        const customLabel = (<span className="cus-label">
            <span>operations: </span>
            <span style={{ color: 'blue' }} onClick={this.onEdit}>Edit</span>&nbsp;
        <label onClick={(e) => e.stopPropagation()}><input type="checkbox" /> checked</label> &nbsp;
        <span style={{ color: 'red' }} onClick={this.onDel}>Delete</span>
        </span>);

        const loop = data => {
            return data.map((item) => {
                if (item.children && item.children.length) {
                    return <TreeNode title={item.name} key={item.id}>{loop(item.children)}</TreeNode>;
                }
                return <TreeNode title={item.name} key={item.id} />;
            });
        };

        return (
            <section className="reportsPage">
                <HmeHeader />
                <div className="reports">
                    <SuccessAlert successMessage={this.state.successMessage} />
                    <ErrorAlert errorMessage={this.state.errorMessage} />
                    <header className="reportsHeader">
                        Summary Reports
                </header>                  
                    <form onSubmit={this.handleSubmit}>
                        <section className='reportsPaneSection'>
                            <div className="reportsPane">
                                <div className="checkboxSectionsAdvanced">
                                    <div className="timings"> <input type="checkbox" /> <span className="spanHeading"><span> Select All </span> <span className="tip openTip">?</span></span> </div>
                                    <div className="timings">  <span>Brand</span> </div>
                                </div>

                                <div className="savedReports">
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
                                        onCheck={this.onCheck}
                                    >

                                        {loop(this.state.treeData)}
                                    </Tree>
                                </div>
                                <span className="spanHeading"><span> Time Measures </span> <span className="tip openTip">?</span></span>
                                <div>
                                    <select name="timeMeasure" className="timeMeasures" onChange={this.changeTimeMeasure.bind(this)}>
                                        <option selected={this.state.timeMeasure ==1} value='1'>Day</option>
                                        <option selected={this.state.timeMeasure ==2} value='2'> Daypart</option>
                                        <option selected={this.state.timeMeasure ==3} value='3'> Week </option>
                                        <option selected={this.state.timeMeasure ==4} value='4'> Raw Data Report</option>
                                    </select>
                                </div>
                                <div className="calendarSection">
                                    <div className="dateFrom">
                                        <span className="spanHeading"><span> From </span> <span className="tip openTip">?</span></span>
                                        <div className="calendar">
                                            <div className="calendarIcon"><img src={Calendar} aria-hidden="true" /> </div>
                                            <DateTimeField className="dateTime" mode={date} timeFormat={false} inputProps={{ readOnly: true }} closeOnSelect ref="fromDate" value={this.state.fromDate} onChange={(e) => this.changeDate(e, 'from')}/>
                                        </div>
                                    </div>
                                    <div className="dateTo">
                                        <span className="spanHeading"><span> To </span><span className="tip openTip">?</span></span>
                                        <div className="calendar">
                                            <div className="calendarIcon"><img src={Calendar} aria-hidden="true" /> </div>
                                            <DateTimeField className="dateTime" mode={date} timeFormat={false} inputProps={{ readOnly: true }} closeOnSelect ref="toDate" value={this.state.toDate} onChange={(e) => this.changeDate(e, 'to')}/>
                                        </div>
                                    </div>
                                </div>

                                <div>

                                    <span onClick={this.showAdvanced.bind(this)}> Advanced Options </span>
                                    <div className={"advancedOptionSection " + (this.state.showAdvancedOptions ? 'show' : 'hidden')}>
                                        <div className="checkboxSectionsAdvanced">
                                            <div className="timings">
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
                                            <div className="timings">
                                                <TimePicker
                                                    defaultValue={this.state.closeTime}
                                                    onChange={this.handleValueChange}
                                                    showSecond={false}
                                                    use12Hours={true}
                                                    disabled={this.state.close}
                                                    onChange={this.timeChange.bind(this,'closeTime')}
                                                    name='close'
                                                    value={this.state.closeTime}
                                                />
                                            </div>
                                        </div>

                                        <div className="checkboxSectionsAdvanced">
                                            <div className="timings"> <input name='open' type="checkbox" checked={this.state.open} onChange={this.check.bind(this, this.state.open)} />  <span className="spanHeading"><span> Open </span><span className="tip openTip" >?</span></span> </div>
                                            <div className="timings"> <input name='close' type="checkbox" checked={this.state.close} onChange={this.check.bind(this, this.state.close)} />  <span className="spanHeading"><span> Close </span> <span className="tip openTip" >?</span></span> </div>
                                        </div>
                                        <span>Type </span>
                                        <div className="checkboxSections">
                                            <div className="TypeSubSection"> <input type="radio" name="type" checked={this.state.type == 1 ? true : false} onChange={this.handleOnChange.bind(this)} value={1} />  <span className="spanHeading"><span> Time Slice </span>  <span className="tip openTip">?</span></span></div>
                                            <div className="TypeSubSection"> <input type="radio" name="type" checked={this.state.type == 2 ? true : false} onChange={this.handleOnChange.bind(this)} value={2} />  <span className="spanHeading"><span> Cumulative </span> <span className="tip openTip">?</span> </span> </div>
                                        </div>
                                        <span className="note"> *Reports including Advanced Options are generated by CSV and sent by email. </span>
                                    </div>
                                </div>

                                <span>Include </span>
                                <div className="checkboxSections">
                                    <div> <input type="checkbox" disabled={this.state.showAdvancedOptions}  value={1} onChange={this.include.bind(this)} /> Longest Time </div>
                                    <div> <input type="checkbox" disabled={this.state.showAdvancedOptions}  value={2} onChange={this.include.bind(this)} /> System Statistics </div>
                                </div>
                                <span className="spanHeading"><span> Format </span> <span className="tip openTip">?</span></span>
                                <div className="checkboxSections">
                                    <div> <input type="radio" name="format" checked={this.state.format == 1? true : false} onChange={this.handleOnChange.bind(this)} value={1}/> Seconds(sec) </div>
                                    <div> <input type="radio" name="format" checked={this.state.format==2?true:false} onChange={this.handleOnChange.bind(this)} value={2}/> Minutes(min:sec) </div>
                                </div>
                            </div>
                            <div className="reportsPane">
                                <span className="spanHeading"><span> Saved Reports Templates </span> <span className="tip openTip">?</span> </span>
                                <div className="savedReports">
                                    {this.savedReports()}
                                </div>
                                <span>Criteria</span>
                                <div className="container criteria">
                                    <div className="col-md-12" > Stores :  </div>
                                    <div className="col-md-6"> From: {this.state.fromDate} </div>
                                    <div className="col-md-6" > To: {this.state.toDate}</div>
                                    <div className="col-md-12"> Time Measure:{this.state.timeMeasure}</div>
                                    <div className="col-md-12"> Include: {this.state.include.length?this.renderInclude():'None'}</div>
                                    <div className="col-md-12"> Format: {this.state.format}</div>
                                </div>
                                <span><input name='saveAsTemplate' type="checkbox" value={this.state.saveAsTemplate} onChange={this.check.bind(this, this.state.saveAsTemplate)}/>Save as Template </span>
                                <div>
                                    <input name='templateName' className="saveTemplate"  placeholder="(Name this template)" value={this.state.templateName} onChange={this.handleOnChange.bind(this)} maxLength={25} />
                                </div>
                                <div type="submit"  className="generateReports" onClick={this.generate.bind(this)}> Generate Report </div>
                            </div>
                        </section>
                    </form>
                </div>
            </section>
        );
    }


    timeChange(name,e) {
        let time = e.format('HH:mm a');
        console.log(time);
     }

    handleOnChange(e) {
      
        const { name, value } = e.target;
        this.setState(
            {
                [e.target.name]: e.target.value
            }
        )
    }

    check(value, e) {
        if (!value) {
            this.setState(
                {
                    [e.target.name]: !value
                }
            )
        }
        this.setState(
            {
                [e.target.name]: !value
            }
        )
    }
    handleFormSubmit(e) {
        e.preventDefault();

        this.Auth.login(this.state.username, this.state.password)
            .then(token => {
                this.setState(
                    {
                        token: token
                    })
                const url = 'http://localhost:3002/' + token;
                window.location.assign(url);
                this.props.history.replace(url);
            })
            .catch(err => {
                alert(err);
            })
    }

    showAdvanced(e) {

        let showAdvancedOptions = this.state.showAdvancedOptions;
        if (!showAdvancedOptions) {
            this.setState({ include: [] })
        }
        this.setState(
            {
                showAdvancedOptions: !showAdvancedOptions
            }
        )
    }

    getSavedReports() {
        fetch('http://localhost:7071/api/reportTemplate/list?accountId=100&createdBy=1000', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    savedTemplates: data.data
                })
            })
            .catch((error) => {
            });
    }

    savedReports() {
        let savedTemplates = this.state.savedTemplates;

        if (savedTemplates) {
            let renderSavedTemplates = savedTemplates.map((report, index) => {
                return (
                    <div key={index} title={report.TemplateName}>
                        <div className='col-md-10 savedName' id={report.Id} onClick={this.apply.bind(this)}> {report.TemplateName}  </div>
                        <div className='col-md-2 deleteIcon' id={report.Id} onClick={this.delete.bind(this)}>     <span id={report.Id}  ><img className="logOutIcon" id={report.Id} src={Delete} aria-hidden="true" /></span> </div>
                    </div>
                )
            });
            return renderSavedTemplates;
        }
        
    }

    renderTimeMeasures() {
        let timeMeasures = this.state.timeMeasures && this.state.timeMeasures.map(function (timeMeasure, index) {
            return <option value={timeMeasure.Id} >{timeMeasure.Type}</option>
        })
        return timeMeasures;
    }


     changeTimeMeasure(e) {
        const { name, value } = e.target;
        this.setState(
            {
                timeMeasure: value
            })       
       }
       
apply(e) {
       let url = 'http://localhost:7071/api/reportTemplate/gettemplate?templetId=' + e.target.id;
       fetch(url, {
           method: "GET",
           headers: {
               "Content-Type": "application/json",
               'Accept': 'application/json',
               'Cache-Control': 'no-cache',
               'Pragma': 'no-cache'
           }
       })
           .then((response) => response.json())
           .then((data) => {
               let template = data.data;
               console.log(template);
               template = {
                   "store": [
                       "100",
                       "102"
                   ],
                   "timeMeasures": 3,
                   "fromDate": "02/03/2018",
                   "toDate": "02/03/2018",
                   "openTime": '12:08 am',
                   "closeTime": '12:08 am',
                   "templateName": "samples",
                   "open": false,
                   "close": false,
                   "type": 1,
                   "include": [1, 2],
                   "format": 1,
               }
               this.setState({ format: template.format });
               this.setState({ type: template.type});
               this.setState({ open: template.open });
               this.setState({ close: template.close });
               this.setState({ timeMeasure: template.timeMeasures });
               this.setState({ fromDate: template.fromDate });
               this.setState({ toDate: template.toDate });
               if (template.open == false) {
                   this.state.openTime = moment('12:05 am', 'HH:mm A');
               }
               if (template.close == false) {
                   this.state.closeTime = moment('12:05 am', 'HH:mm A');
               }
            
               this.setState(this.state);
              })
           .catch((error) => {
             });
     }

       
     delete ( e ) {
        // console.log(e.target.id);
         let url = 'http://localhost:7071/api/reportTemplate/delete?templetId=' + e.target.id;
         fetch(url, {
             method: "DELETE",
             headers: {
                 "Content-Type": "application/json",
                 'Accept': 'application/json',
                 'Cache-Control': 'no-cache',
                 'Pragma': 'no-cache'
             }
         })
             .then((response) => response.json())
             .then((data) => {
                 this.state.successMessage = data.data;
                 this.state.errorMessage = "";
                 this.setState(this.state);
                 this.getSavedReports();
             })
             .catch((error) => {
                 this.state.errorMessage = "ERROR";
                 this.state.successMessage = "";
                 this.setState(this.state);
             });
     }


     generate(e) {
         console.log(this.state.fromDate);
         console.log(this.state.toDate);
         console.log(this.state.format);
         console.log(this.state.timeMeasure);
         console.log(this.state.type);
         console.log(this.state.openTime);
         console.log(this.state.closeTime);
         console.log(this.state.type);
         if (this.state.toDate < this.state.fromDate) {
             this.state.errorMessage = "Date range invalid. Starting date may not be beyond ending date.";
             this.setState(this.state);
         }

         if ((moment(this.state.toDate).format('MM/DD/YYYY') - moment(this.state.fromDate).format('MM/DD/YYYY')) > 31) {
             this.state.errorMessage = "Date range invalid. For Day Reports select any 1 month period.";
             this.setState(this.state);
         }
         
         if (this.state.saveAsTemplate) {
             if (this.state.templateName) {

             }
         }
         else {
             
         }
     }

        changeDate(date, dateSelection) {
            let selectedDate = moment(date, 'MM/DD/YYYY').format('MM/DD/YYYY');
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
            let include = this.state.include;

            if (_.contains(include, e.target.value)) {
                include = _.filter(include, function (value) { return value !== e.target.value });
            }
            else {
                include.push(e.target.value);
            }
            this.setState({
                include: include
            })
        }

        renderInclude(e) {
            let include = this.state.include;
            let renderInclude;
            if (include) {
                renderInclude = include.map(function (include, index) {
                    return (
                        <span key={index}><span className={(index == 0 ? 'hidden' : '')}>,</span> {include}</span>
                    )
                });
            }
            else {
                renderInclude = include.map(function (include, index) {
                    return (
                        <span>None</span>
                    )
                });
            }
            return renderInclude;        
        }
    }

export default Login;