import React from "react"
import CheckBoxList from "./CheckBoxList"
import SuccessAlert from "../Alerts/SuccessAlert"
import ErrorAlert from "../Alerts/ErrorAlert"
import fetch from 'isomorphic-fetch'
import HmeHeader from '../Header/HmeHeader'
import ReportGroupTree from './ReportGroupTree'
import { browserHistory } from 'react-router-dom'
//import {body} from 'body-parser';
var body = require('body-parser');
var _ = require('underscore');



export default class ReportGroupHierarchy extends React.Component {

    constructor(){
        super();
        this.state = {
          treeData : [
            {
              id: 1,
              name : "group1",
              children : [
                {
                  id: 11,
                  name : "Group2",
                  children : [
                    {
                      id:111,
                      name : "store1"
                    },{
                      id:112,
                      name : "store2"
                    }
                  ]
                },
                {
                  id:12,
                  name : "store3",
                  children : []
                }
              ]
            },{
              id: 2,
              name : "group3",
              children : [
                {
                  id : 21,
                  name : "store4",
                  children : []
                }
              ]
            },{
              id: 3,
              name : "group4",
              children : [
                {
                  id:31,
                  name : "store5",
                  children : [
                    {
                      id:311,
                      name : "store6",
                      children:[]
                    },{
                      id:312,
                      name : "store7",
                      children:[]
                    }
                  ]
                }
              ]
            }
          ]
        };

    }
   onExpand (expandedKeys) {
     console.log('onExpand', expandedKeys, arguments);
   }
   onSelect (selectedKeys, info) {
     console.log('selected', selectedKeys, info);
     this.selKey = info.node.props.eventKey;
   }
   onCheck(checkedKeys, info) {
     console.log('onCheck', checkedKeys, info);
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


    render() {

        return (<section className="groupManagementSection"><HmeHeader />
            <section className="groupHierarchyTreeSection">
              <div>
                  <h1>Reporting Group Management</h1>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <button type="button" className="btn btn-primary col-xs-2 reportGroupSave">Add New Group</button>
                </div>
              </div>

              <div className="row groupHierarchyTree">
                <ReportGroupTree treeData = {this.state.treeData}></ReportGroupTree>
              </div>
            </section>
        </section>);
    }
}
