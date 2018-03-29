import React from "react"
import CheckBoxList from './CheckBoxList'
import App from '../../App'
import ReportGroupHierarchy from './ReportGroupHierarchy'
import SuccessAlert from "../Alerts/SuccessAlert"
import ErrorAlert from "../Alerts/ErrorAlert"
import fetch from 'isomorphic-fetch'
import { confirmAlert } from 'react-confirm-alert'
import './ReportGroup.css'
import HmeHeader from '../Header/HmeHeader'
import { BrowserRouter as Router, Route , Link  } from 'react-router-dom'
import 'react-confirm-alert/src/react-confirm-alert.css'
//import createHistory from 'history/createBrowserHistory'
//import {body} from 'body-parser';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const downArrow = require('../../images/downArrow.PNG')
const sideArrow = require('../../images/sideArrow.PNG')
const groupToggleIcon = require('../../images/groupToggleIcon.png')

var body = require('body-parser');
var _ = require('underscore');


export default class ReportGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            available: [],
            assigned: [],
            counter: 0,
            successMessage: "",
            errorMessage: "",
            editGroup : false,
            accountId:null,
            groupId:null,
            saveSuccess : false,
            deleteSuccess : false
        };
        //this.populateGroupDetails();
        this.getAvailableGroupStoreList();
    }

    componentDidMount(){
      this.populateGroupDetails();
    }

    getAvailableGroupStoreList(){
      this.state.available = [];
      this.setState(this.state);
      let url = "http://localhost:7071/api/group/availabledetails?accountId=100&userName=swathikumary@nousinfo.com";
      fetch(url)
          .then((response) => response.json())
          .then((data) => {
            console.log(data.data);
              this.state.available = data.data;
              this.setState(this.state);
          })
          .catch((error) => {
            this.state.successMessage = "";
            this.state.errorMessage = error.message;
            this.setState(this.state);
          });

    }

    populateGroupDetails(){
      this.state.editGroup = this.props.history.location.state.editGroup;
      this.state.groupId = this.props.history.location.state.groupId;
      this.setState(this.state);
      console.log(this.state.assigned);
      if(this.props.history.location.state.editGroup){
        //let groupId = this.props.history.location.state.groupId;
        let url = 'http://localhost:7071/api/group/edit?groupId='+this.state.groupId+'&userName=swathikumary@nousinfo.com';

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if(data.status == false){
                  this.state.successMessage = data.data;
                  this.state.errorMessage = "";
                  this.state.assigned = [];
                  this.setState(this.state);
                }else{
                  this.state.accountId = data.data.group.AccountId;
                  this.refs.groupName.value = data.data.group.GroupName;
                  this.refs.groupDescription.value = data.data.group.Description;
                  this.state.assigned = data.data.details;
                  this.setState(this.state);
                }

            })
            .catch((error) => {
              this.state.successMessage = "";
              this.state.errorMessage = error.message;
              this.setState(this.state);
            });

      }else{
        this.refs.groupName.value = "";
        this.refs.groupDescription.value = "";
      }


    }

    move(source, target) {
        var index = 0;
        while (index < source.length) {
            var item = source[index];
            if (item.selected) {
                item.selected = false;
                target.push(item);
                source.splice(index, 1);
            } else {
                index++;
            }
        }
    }
    toggle(item) {
        debugger;
        item.selected = !item.selected;
        this.setState(this.state);
    }

    selectAll(event, list) {
        list.map((item, index) => item.selected = event.target.checked);
        this.setState(this.state);
    }
    add() {
        this.move(this.state.available, this.state.assigned);
        this.setState(this.state);
    }
    remove() {
        this.move(this.state.assigned, this.state.available);
        this.setState(this.state);
    }


    saveAssigned(items) {
        this.state.editGroup = this.props.history.location.state.editGroup;
        this.setState(this.state);
        let groupStoreObject = this.getGroupandStore(items);
        let url = "http://localhost:7071/api/group/create";

        if(this.refs.groupName.value === "" || this.refs.groupName.value === undefined){
          this.state.errorMessage = "Group name may not be blank";
          this.state.successMessage = "";
          this.setState(this.state);
        } else{
          let data = {
              id: null,
              name: "",
              description: "",
              groups: [],
              stores: []
          };
          if(this.state.editGroup){
            data = {
                id: this.props.history.location.state.groupId,
                name: this.refs.groupName.value,
                description: this.refs.groupDescription.value,
                groups: groupStoreObject.group,
                stores: groupStoreObject.store
            };
          }else{
            data = {
                id: null,
                name: this.refs.groupName.value,
                description: this.refs.groupDescription.value,
                groups: groupStoreObject.group,
                stores: groupStoreObject.store
            };
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

                  this.state.successMessage = data.data;
                  this.state.errorMessage = "";
                  this.state.saveSuccess = true;
                  this.setState(this.state);
                  this.getAvailableGroupStoreList();
              })
              .catch((error) => {
                  this.state.successMessage = "";
                  this.state.errorMessage = error.message;
                  this.setState(this.state);
              });

        }

          //history.push('/grouphierarchy');
    }


    getGroupandStore(items) {
        var groupStore = {
            group: [],
            store: []
        };
        _.each(items, function (item) {
            if (item.type == "group") {
                groupStore.group.push(item.Id);
            } else if (item.type == "store") {
                groupStore.store.push(item.Id);
            }
        });

        return groupStore;
    }

    deleteGroup() {
        confirmAlert({
          title: 'Confirm to Delete',
          message: 'Are you sure you want to remove this user?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => {
                this.confirmDelete();
              }
            },
            {
              label: 'No',
              onClick: () => {

              }
            }
          ]
        })
    }

    confirmDelete(){
      //let url = 'http://localhost:7071/api/group/delete?groupId=12&accountId=0';
      let url = 'http://localhost:7071/api/group/delete?groupId='+this.state.groupId+'&accountId='+this.state.accountId;
      fetch(url, {
          method: "DELETE"
      })
      .then((data) => {
          if(data.status == 200){
            this.state.successMessage = "Group Deleted Successfully";
            this.state.errorMessage = "";
            this.state.deleteSuccess = true;
            this.setState(this.state);

          }else{
            this.state.errorMessage = "Unable to delete group data";
            this.state.successMessage = "";
            this.setState(this.state);
          }

          //this.props.history.push('/grouphierarchy');
      })
      .catch((error) => {
          this.state.errorMessage = error.message;
          this.state.successMessage = "";
          this.setState(this.state);
      });
    }

    render() {
        let assigned = this.state.assigned;
        let unAssigned = this.state.available;
        return (<section className="groupDetailsPage"><HmeHeader />
          <div className="statusMessages">
            <SuccessAlert successMessage={this.state.successMessage}/>
            <ErrorAlert errorMessage={this.state.errorMessage} />
          </div>
            <section className={"reportContainer "+(this.state.saveSuccess || this.state.deleteSuccess ? "hide" : "show")}>
              <div>
                  <h1>Reporting Group Details</h1>
              </div>
              <div className="row reportGroupName">
                  <div className="form-group">
                      <label htmlFor="groupName" className="control-label col-xs-3 groupNameLabel">Group Name : <span>*</span></label>
                      <div className="col-xs-6">
                          <input type="text" ref="groupName" className="form-control" maxLength="50"/>
                      </div>
                  </div>
              </div>

              <div className="row reportDescription">
                  <div className="form-group">
                      <label htmlFor="groupName" className="control-label col-xs-3 groupLabelDescription">Group Description : </label>
                      <div className="col-xs-6">
                          <textarea rows="4" ref="groupDescription" cols="53" className="form-control" maxLength="200"></textarea>
                      </div>
                  </div>
              </div>

              <div className="row groupSeperation">
                  <CheckBoxList title="Available Groups/Stores" items={this.state.available} selectAll={(e, items) => this.selectAll(e, items)} toggle={(item) => this.toggle(item)} />
                  <div className="col-xs-2 moveGroupStore">
                      <div className="moveToHierarchy pull-center"><button className="btn btn-default" onClick={this.add.bind(this)} >&gt;</button></div>
                      <div className="removeFromToHierarchy pull-center"><button className="btn btn-default" onClick={this.remove.bind(this)}>&lt; </button></div>
                  </div>
                  <CheckBoxList title="Groups/Stores in Group" items={this.state.assigned} selectAll={(e, items) => this.selectAll(e, items)} toggle={(item) => this.toggle(item)} />
              </div>

              <div className="row reportGroupButtons">
                  <div className="col-xs-12">
                      <button type="button" className="btn btn-primary  col-xs-2 reportGroupSave" onClick={this.saveAssigned.bind(this, assigned)}>Save</button>
                      <button type="button" className={"btn btn-danger reportGroupDelete col-xs-2 "+(this.state.editGroup ? 'show' : 'hidden')} onClick={this.deleteGroup.bind(this)} >Delete</button>
                      <Link to="/grouphierarchy"><button type="button" className="btn btn-default reportGroupCancel  col-xs-2">Cancel</button></Link>
                  </div>
              </div>

            </section>
        </section>);
    }
}
