import React from 'react'
import CheckBoxList from './CheckBoxList'
import SuccessAlert from '../Alerts/SuccessAlert'
import ErrorAlert from '../Alerts/ErrorAlert'
import fetch from 'isomorphic-fetch'
import { confirmAlert } from 'react-confirm-alert'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import AuthenticationService from '../Security/AuthenticationService'
import { Link } from 'react-router-dom'
import {Config} from '../../Config'
import {CommonConstants} from '../../Constants'
import Api from '../../Api'
import './ReportGroup.css'
import 'react-confirm-alert/src/react-confirm-alert.css'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

var _ = require('underscore')

export default class ReportGroup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage(),
      available: [],
      assigned: [],
      counter: 0,
      successMessage: '',
      errorMessage: '',
      editGroup: false,
      accountId: 100,
      groupId: null,
      saveSuccess: false,
      deleteSuccess: false,
      // deleteSuceessMessage: 'Group Deleted Successfully',
      // deleteErrorMessage: 'Unable to delete group data',
      userContext: {}
    }
    this.api = new Api()
    this.getAvailableGroupStoreList()
    this.authService = new AuthenticationService(Config.authBaseUrl)
    this.renderButtonGroups = this.renderButtonGroups.bind(this)
  }

  componentDidMount () {
    this.populateGroupDetails()
    this.state.userContext = this.authService.getProfile()
    this.setState(this.state)
  }

  getAvailableGroupStoreList () {
    this.state.available = []
    this.setState(this.state)
    let url = Config.apiBaseUrl + CommonConstants.apiUrls.getAvailableGroups
    this.api.getData(url,data => {
       let groupId = parseInt(this.props.history.location.state.groupId)
       let available = _.without(data.data, _.findWhere(data.data, {
         Id: groupId
       }));
      this.setState({available : available})
    }, error => {
      this.state.successMessage = ''
      this.state.errorMessage = error.message
      this.setState(this.state)
    })
  }
  renderButtonGroups(assigned){
    let language = this.state.currentLanguage
    if(this.state.userContext.IsAccountOwner === 1){
      return(
        <div className='row reportgroup-buttons'>
          <div className='col-xs-12'>
            <div className="border-right"> <button type='button' className='btn btn-primary  save-group-btn' onClick={this.saveAssigned.bind(this, assigned)}>{t[language].save}</button> </div>
            <div className="border-right"> <span  className={'btn-pipe ' + (this.state.editGroup ? 'show' : 'hidden')}> | </span><button type='button' className={'btn btn-danger reportgroup-delete ' + (this.state.editGroup ? 'show' : 'hidden')} onClick={this.deleteGroup.bind(this)} > {t[language].delete}</button> </div>
            <div> <span className='btn-pipe'> | </span> <Link to='/grouphierarchy' className='col-xs-2 reportgroup-cancel'>{t[language].cancel}</Link> </div>
          </div>
        </div>
      )
    }else{
      return <div></div>
    }
  }
  populateGroupDetails () {
    this.state.editGroup = this.props.history.location.state.editGroup
    this.state.groupId = this.props.history.location.state.groupId
    this.setState(this.state)
    if (this.props.history.location.state.editGroup) {
        let url = Config.apiBaseUrl + CommonConstants.apiUrls.editGroupDetails + '?groupId=' + this.state.groupId
        this.api.getData(url,data => {
          if (data.status === false) {
            this.state.successMessage = data.data
            this.state.errorMessage = ''
            this.state.assigned = []
            this.setState(this.state)
          } else {
            this.state.accountId = data.data.group.AccountId
            this.refs.groupName.value = data.data.group.GroupName
            this.refs.groupDescription.value = data.data.group.Description
            this.state.assigned = data.data.details
            this.setState(this.state)
          }
        }, error => {
          this.state.successMessage = ''
          this.state.errorMessage = error.message
          this.setState(this.state)
        })

    } else {
      this.refs.groupName.value = ''
      this.refs.groupDescription.value = ''
    }
  }

  move (source, target) {
    var index = 0
    while (index < source.length) {
      var item = source[index]
      if (item.selected) {
        item.selected = false
        target.push(item)
        source.splice(index, 1)
      } else {
        index++
      }
    }
  }
  toggle (item) {
    item.selected = !item.selected
    this.setState(this.state)
  }

  selectAll (event, list) {
    list.map((item, index) => {item.selected = event.target.checked})
    this.setState(this.state)
  }
  add () {
    this.move(this.state.available, this.state.assigned)
    this.setState(this.state)
  }
  remove () {
    this.move(this.state.assigned, this.state.available)
    this.setState(this.state)
  }

  saveAssigned (items) {
    let language = this.state.currentLanguage
    this.state.editGroup = this.props.history.location.state.editGroup
    this.refs.groupName.value = this.refs.groupName.value.trim()
    this.setState(this.state)
    let groupStoreObject = this.getGroupandStore(items)
    if (this.refs.groupName.value === '' || this.refs.groupName.value === undefined) {
      this.state.errorMessage = t[language]['Group name may not be blank']
      this.state.successMessage = ''
      this.setState(this.state)
    } else {
      let data = {
        id: null,
        name: '',
        description: '',
        groups: [],
        stores: []
      }
      if (this.state.editGroup) {
        data = {
          id: this.props.history.location.state.groupId,
          name: this.refs.groupName.value,
          description: this.refs.groupDescription.value,
          groups: groupStoreObject.group,
          stores: groupStoreObject.store
        }
      } else {
        data = {
          id: null,
          name: this.refs.groupName.value,
          description: this.refs.groupDescription.value,
          groups: groupStoreObject.group,
          stores: groupStoreObject.store
        }
      }

      let url = Config.apiBaseUrl + CommonConstants.apiUrls.addNewGroup
      this.api.postData(url,data,data => {
        if(data.status === true){
          this.state.successMessage = t[language][data.key]
          this.state.errorMessage = ''
          this.state.saveSuccess = true
          this.setState(this.state)
          this.props.history.push("/message", data.key); 
          this.getAvailableGroupStoreList()
        }else{
          this.state.errorMessage = t[language][data.key]
          this.state.successMessage = ''
          this.setState(this.state)
        }
      
      }, error => {
        this.state.successMessage = ''
        this.state.errorMessage = t[language][data.key]
        this.setState(this.state)
      })
    }

  }

  getGroupandStore (items) {
    var groupStore = {
      group: [],
      store: []
    }
    _.each(items, function (item) {
      if (item.Type === 'group') {
        groupStore.group.push(item.Id)
      } else if (item.Type === 'store') {
        groupStore.store.push(item.Id)
      }
    })

    return groupStore
  }

  deleteGroup () {
   confirmAlert({
      title: t[this.state.currentLanguage]['confirmToDelete'],
      message: t[this.state.currentLanguage]['areyousureremovegroup'],
      buttons: [
        {
          label: t[this.state.currentLanguage]['yes'],
          onClick: () => {
            this.confirmDelete()
          }
        },
        {
          label: t[this.state.currentLanguage]['no'],
          onClick: () => {

          }
        }
      ]
    })
  }

  confirmDelete () {
      let language = this.state.currentLanguage
      let url = Config.apiBaseUrl + CommonConstants.apiUrls.deleteGroup + '?groupId=' + this.state.groupId
      
      this.api.deleteData(url,data => {
        if (data.status === true) {
          this.state.successMessage = t[language][data.key]
          this.state.errorMessage = ''
          this.state.deleteSuccess = true
          this.setState(this.state)
          this.props.history.push("/message", data.key); 
        } else {
          this.state.errorMessage = t[language][data.key]
          this.state.successMessage = ''
          this.setState(this.state)
        }
      }, error => {
        this.state.errorMessage = t[language][error.key]
        this.state.successMessage = ''
        this.setState(this.state)
      })
  }

  render () {
    let language = this.state.currentLanguage
    let assigned = this.state.assigned
    return (<section className='groupDetailsPage'>
      <div className='status-messages'>
        {/* <SuccessAlert successMessage={this.state.successMessage} /> */}
        <ErrorAlert errorMessage={this.state.errorMessage} />
      </div>
      <section className={'report-container ' + (this.state.saveSuccess || this.state.deleteSuccess ? 'hide' : 'show')}>
        <div>
          <h1>{t[language].ReportingGroupDetails}</h1>
        </div>
        <div className='row reportgroup-name'>
          <div className='form-group'>
            <label htmlFor='groupName' className='control-label col-xs-3 group-name-label'>{t[language].GroupName} : <span>*</span></label>
            <div className='col-xs-6'>
              <input type='text' ref='groupName' className='form-control' maxLength='50' />
            </div>
          </div>
        </div>

        <div className='row report-description'>
          <div className='form-group'>
            <label htmlFor='groupName' className='control-label col-xs-3 group-label-description'>{t[language].GroupDescription} : </label>
            <div className='col-xs-6'>
              <textarea rows='4' ref='groupDescription' cols='53' className='form-control' maxLength='200' />
            </div>
          </div>
        </div>

        <div className='row group-seperation'>
          <CheckBoxList title={t[language].AvailableGroupsStores} items={this.state.available} selectAll={(e, items) => this.selectAll(e, items)} toggle={(item) => this.toggle(item)} />
          <div className='col-xs-2 move-group-store'>
            <div className='moveToHierarchy pull-center'><button className='btn btn-default' onClick={this.add.bind(this)} >&gt;</button></div>
            <div className='removeFromToHierarchy pull-center'><button className='btn btn-default' onClick={this.remove.bind(this)}>&lt; </button></div>
          </div>
          <CheckBoxList title={t[language].GroupsStoresinGroup} items={this.state.assigned} selectAll={(e, items) => this.selectAll(e, items)} toggle={(item) => this.toggle(item)} />
        </div>
        {this.renderButtonGroups(assigned)}
      </section>
    </section>)
  }
}
