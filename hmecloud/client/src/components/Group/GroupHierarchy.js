import React, { Component } from "react";
import Tree, { TreeNode } from "rc-tree";
import { Config } from '../../Config'
import { CommonConstants } from '../../Constants'
import Api from '../../Api'


export default class GroupHierarchy extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selected:[],
            groups:[]
        }
        this.api = new Api()
    }
    componentDidMount() {
        this.load()
        debugger;
    }

    onCheck(checkedKeys, node) {
    }
    load() {
        let url = Config.apiBaseUrl + CommonConstants.apiUrls.getGroupHierarchyTree
        this.api.getData(url, data => {
            this.state.groups = data.data
            this.setState(this.state)
        })
    }
    getNodeContent(item) {
        return (
            <div className="storeTree">
                <span className="StoreTitile">{item.Name ? (item.StoreNumber ? item.StoreNumber + '-' : '') + item.Name : item.StoreNumber ? item.StoreNumber : ''}</span>
                <span className="StoreBrand">{item.Brand ? item.Brand : ''}</span>
            </div>
        )
    }
    render() {
        const loop = data => {
            return data.map(item => {
                if (item.Children && item.Children.length) {
                    return (
                        <TreeNode title={this.getNodeContent(item)} className={item.StoreNumber} key={item.Type == 'store' ? item.DeviceUID : item.Id} value={item.Type == 'store' ? item.DeviceUID : item.Id} type={item.Type}>
                            {loop(item.Children)}
                        </TreeNode>
                    );
                }
                return <TreeNode title={this.getNodeContent(item)} className={item.StoreNumber} key={item.Type == 'store' ? item.DeviceUID : item.Id} value={item.Type == 'store' ? item.DeviceUID : item.Id} type={item.Type} />;
            });
        };
        return (<div className="saved-reports">
            <Tree
                className="myCls"
                showIcon={false}
                showLine= {true}
                checkable
                selectable={false}
                defaultExpandAll
                onExpand={this.onExpand}
                defaultSelectedKeys={this.state.selected}
                defaultCheckedKeys={this.state.selected}
                onSelect={this.onSelect}
                onCheck={this.onCheck.bind(this)}
                checkedKeys={this.state.selected}
            >
                {loop(this.state.groups)}
            </Tree>
        </div>
        )
    }
}