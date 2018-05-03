import React from 'react'
import fetch from 'isomorphic-fetch'
import Tree, { TreeNode } from 'rc-tree'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import { Config } from '../../Config'
import {CommonConstants} from '../../Constants'
import AuthenticationService from '../Security/AuthenticationService'
import Api from '../../Api'
import 'rc-tree/assets/index.css'
import './ReportGroup.css'
// import { BrowserRouter } from 'react-router-dom'

// import {body} from 'body-parser';

export default class ReportGroupHierarchy extends React.Component {
  constructor () {
    super()
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage(),
      treeData: [
      ],
      editGroup: false,
      groupId: null,
      userContext: {}
      
    }
    this.api = new Api()
    this.getTreeHierarchy()
    this.renderAddButton = this.renderAddButton.bind(this)
    this.authService = new AuthenticationService(Config.authBaseUrl)
  }

  componentDidMount(){
    this.state.userContext = this.authService.getProfile()
    this.setState(this.state)
  }

  getTreeHierarchy () {
      let url = Config.apiBaseUrl + CommonConstants.apiUrls.getGroupHierarchyTree
      this.api.getData(url,data => {
        this.state.treeData = data.data
        this.setState(this.state)
      }, error => {
        this.state.successMessage = ''
        this.state.errorMessage = error.message
        this.setState(this.state)
      })
  }
  renderAddButton(){
    let language = this.state.currentLanguage
    if(this.state.userContext.IsAccountOwner === 1){
      return(
        <button type='button' className='btn btn-primary  add-group-btn' onClick={this.addNewGroup.bind(this)}>{t[language].AddNewGroup}</button>
      )
    }else{
      return(
        <div></div>
      )
    }
  }

  addNewGroup () {
    this.props.history.push('/groups', this.state)
  }
  onCheck (value, node) {
    this.state.editGroup = true
    this.state.groupId = node.node.props.eventKey
    this.setState(this.state)
    if(node.node.props.type === 'group'){
      this.props.history.push('/groups', this.state)
    }
  }
  render () {
    let language = this.state.currentLanguage
    const loop = data => {
      return data.map((item) => {
        // item.Children = [];

        var cssClass = "treeNode " + (item.Type === "group" ? "group-node" : "store-node");

        if (item.Children && item.Children.length) {
          return <TreeNode className={cssClass} title={item.Name}
            key={item.Id} title={item.Type === 'group' ? item.Name : item.Name ? item.StoreNumber + '-' + item.Name : item.StoreNumber} type={item.Type}>{loop(item.Children)}</TreeNode>
        }
        return <TreeNode className={cssClass} title={item.Type === 'group' ? item.Name : item.Name ? item.StoreNumber + '-' + item.Name : item.StoreNumber} key={item.Id} type={item.Type}/>
      })
    }
    return (<section className='groupManagementSection'>
      <section className='grouphierarchy-tree-section'>
        <div>
          <h1>{t[language].ReportingGroupManagement}</h1>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            {this.renderAddButton()}  
          </div>
        </div>

        <div className='grouphierarchy-tree jumbotron'>
          <div className='col-xs-4'>
            <Tree
              className='hierarchy-tree'
              showLine
              selectable={false}
              checkable
              onExpand={this.onExpand}
              // defaultSelectedKeys={this.state.defaultSelectedKeys}
              // defaultCheckedKeys={this.state.defaultCheckedKeys}
              onSelect={this.onSelect}
              onCheck={(value, node) => this.onCheck(value, node)}
            >

              {loop(this.state.treeData)}

            </Tree>
          </div>
        </div>
      </section>
    </section>)
  }
}
