import React from 'react'
import fetch from 'isomorphic-fetch'
import HmeHeader from '../Header/HmeHeader'
import Tree, { TreeNode } from 'rc-tree'
import { Config } from '../../Config'
import 'rc-tree/assets/index.css'
import './ReportGroup.css'
// import { BrowserRouter } from 'react-router-dom'

// import {body} from 'body-parser';

export default class ReportGroupHierarchy extends React.Component {
  constructor () {
    super()
    this.state = {
      treeData: [
      ],
      editGroup: false,
      groupId: null
    }
    this.getTreeHierarchy()
  }

  getTreeHierarchy () {
    let url = Config.url + 'api/group/getAll?accountId=100&userName=swathikumary@nousinfo.com'
    // let url = "http://localhost:7071/api/group/getAll?accountId=100&userName=swathikumary@nousinfo.com";
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data)
        this.state.treeData = data.data
        this.setState(this.state)
      })
      .catch((error) => {
        this.state.successMessage = ''
        this.state.errorMessage = error.message
        this.setState(this.state)
      })
  }

  addNewGroup () {
    this.props.history.push('/groups', this.state)
  }
  onCheck (value, node) {
    this.state.editGroup = true
    this.state.groupId = node.node.props.eventKey
    this.setState(this.state)
    this.props.history.push('/groups', this.state)
    console.log(node.node.props.eventKey)
  }
  render () {
    const loop = data => {
      return data.map((item) => {
        // item.Children = [];
        if (item.Children && item.Children.length) {
          return <TreeNode className='treeNode' title={item.Name}
            key={item.Id}>{loop(item.Children)}</TreeNode>
        }
        return <TreeNode className='treeNode' title={item.Name} key={item.Id} />
      })
    }
    return (<section className='groupManagementSection'><HmeHeader />
      <section className='grouphierarchy-tree-section'>
        <div>
          <h1>Reporting Group Management</h1>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <button type='button' className='btn btn-primary col-xs-2 save-group-btn' onClick={this.addNewGroup.bind(this)}>Add New Group</button>
          </div>
        </div>

        <div className='row grouphierarchy-tree jumbotron'>
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
