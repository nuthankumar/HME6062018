import React from "react"
import PropTypes from 'prop-types'
import CheckBoxList from "./CheckBoxList"
import SuccessAlert from "../Alerts/SuccessAlert"
import ErrorAlert from "../Alerts/ErrorAlert"
import fetch from 'isomorphic-fetch'
import Tree, { TreeNode } from 'rc-tree'
import 'rc-tree/assets/index.css'
import HmeHeader from '../Header/HmeHeader'
//import {body} from 'body-parser';
var body = require('body-parser');
var _ = require('underscore');



export default class ReportGroupHierarchy extends React.Component {

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
         defaultExpandedKeys: keys,
         defaultSelectedKeys: keys,
         defaultCheckedKeys: keys,
         switchIt: true,
         treeData:[]
       };
    }

    componentDidMount(){
      this.setState({
        treeData: this.props.treeData
      })
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

    loopData(data, callback) {
      const loop = (d, level = 0) => {
      d.forEach((item, index) => {
        const pos = `${level}-${index}`;
        if (item.children) {
          loop(item.children, pos);
        }
        callback(item, index, pos);
      });
    };
    loop(data);
    }

    render() {
        const loop = data => {
          return data.map((item) => {
            if (item.children && item.children.length) {
              return <TreeNode title={item.name} key={item.id}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode title={item.name} key={item.id} />;
          });
        };
        return (
          <div>
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
        );
    }
}
