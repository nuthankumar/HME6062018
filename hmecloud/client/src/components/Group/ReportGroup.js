import React from "react"
import CheckBoxList from "./CheckBoxList"
import { Router } from 'react-router'
import App from '../../App'
// import c from "../../routes";
import { BrowserRouter, Route, Link } from 'react-router-dom'
import ReportGroupHierarchy from './ReportGroupHierarchy'
import SuccessAlert from "../Alerts/SuccessAlert"
import ErrorAlert from "../Alerts/ErrorAlert"
import fetch from 'isomorphic-fetch'
import './ReportGroup.css'
import HmeHeader from '../Header/HmeHeader'
//import createHistory from 'history/createBrowserHistory'
//import {body} from 'body-parser';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

var body = require('body-parser');
var _ = require('underscore');


export default class ReportGroup extends React.Component {
    constructor() {
        super(); this.state = {
            available: [
                { id: 102, name: "Group3", selected: false, type: "group" },
                { id: 103, name: "Group4", selected: true, type: "group" },
                { id: 200, name: "Store1", selected: false, type: "store" },
                { id: 201, name: "Store2", selected: false, type: "store" }],
            assigned: [],
            counter: 0,
            successMessage: "",
            errorMessage: ""
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
        let groupStoreObject = this.getGroupandStore(items);
        let url = "http://localhost:7071/api/group/create";

        let data = {
            id: null,
            name: this.refs.groupName.value,
            description: this.refs.groupDescription.value,
            groups: groupStoreObject.group,
            stores: groupStoreObject.store
        };

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
                this.setState(this.state);
            })
            .catch((error) => {
                this.state.successMessage = "";
                this.state.errorMessage = error.message;
                this.setState(this.state);
            });
          //history.push('/grouphierarchy');
    }


    getGroupandStore(items) {
        var groupStore = {
            group: [],
            store: []
        };
        _.each(items, function (item) {
            if (item.type == "group") {
                groupStore.group.push(item.id);
            } else if (item.type == "store") {
                groupStore.store.push(item.id);
            }
        });

        return groupStore;
    }

    deleteGroup() {
        let url = 'http://localhost/api/group/deletegroup?groupId=101&userName=swathikumary@nousinfo.com';
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
            })
            .catch((error) => {
                this.state.errorMessage = error.message;
                this.state.successMessage = "";
                this.setState(this.state);
            });
    }

    navigateToManageGroup() {

    }
    render() {
        let assigned = this.state.assigned;
        let unAssigned = this.state.available;
        return (<section className="groupDetailsPage"><HmeHeader />
            <section className="reportContainer">
                <div>
                    <h1>Reporting Group Details</h1>
                </div>
                <div className="row">
                    <div className="form-group">
                        <label htmlFor="groupName" className="control-label col-xs-3 groupNameLabel">Group Name : <span>*</span></label>
                        <div className="col-xs-6">
                            <input type="text" ref="groupName" className="form-control" />
                        </div>
                    </div>
                </div>

                <div className="row reportDescription">
                    <div className="form-group">
                        <label htmlFor="groupName" className="control-label col-xs-3 groupLabelDescription">Group Description : </label>
                        <div className="col-xs-6">
                            <textarea rows="4" ref="groupDescription" cols="53" className="form-control"></textarea>
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
                        <button type="button" className="btn btn-danger reportGroupDelete col-xs-2" onClick={this.deleteGroup.bind(this)} >Delete</button>
                        <button type="button" className="btn btn-default reportGroupCancel  col-xs-2"><Link to="/grouphierarchy">Cancel</Link></button>
                    </div>
                </div>
                <SuccessAlert successMessage={this.state.successMessage} />
                <ErrorAlert errorMessage={this.state.errorMessage} />
            </section>
        </section>);
    }
}
