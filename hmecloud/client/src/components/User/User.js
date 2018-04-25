import React, { Component } from 'react'
import ReactDOM from "react-dom";
import './User.css'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import { confirmAlert } from 'react-confirm-alert'
import Tree, { TreeNode } from "rc-tree";
import { Config } from '../../Config'
import { CommonConstants } from '../../Constants'
import Api from '../../Api'
import 'react-confirm-alert/src/react-confirm-alert.css'
import SuccessAlert from '../Alerts/SuccessAlert'
import ErrorAlert from '../Alerts/ErrorAlert'
import moment from "moment";
import * as UserContext from '../Common/UserContext'
import 'url-search-params-polyfill';
import AuthenticationService from '../Security/AuthenticationService'

const _ = require("underscore");

class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage(),
            userEmail: null,
            firstName: null,
            lastName: null,
            isActive: 1,
            userRole: null,
            uuids: [],
            showRemoveUser: null,
            isEdit: null,
            selectAll: false,
            deleteAlertTitle: 'Confirm to Delete',
            confirmDeleteMessage: 'Are you sure you want to remove this user?',
            deleteConfirm: 'Yes',
            deleteCancel: 'No',
            deleteSuceessMessage: 'User Deleted Successfully',
            deleteErrorMessage: 'Unable to delete group data',
            errorMessage: '',
        }
        this.api = new Api()
        this.authService = new AuthenticationService(Config.authBaseUrl)
        let isAdmin = this.authService.isAdmin();
        this.state.isAdmin = isAdmin;
    }

    componentWillMount() {
        const params = new URLSearchParams(this.props.history.location.search);
        const uuid = params.get('uuid') ? params.get('uuid') : null
        this.load(uuid)
        if (uuid) {
            this.setState({ isEdit: true })
            let url = Config.apiBaseUrl + CommonConstants.apiUrls.getUser + '?uuId=' + uuid;
            this.api.getData(url, data => {

                //let userObject = {
                //    "uuId":"98A65FE0-23CE-413B-9093-753733C8",
                //        "isActive":1, "firstName":"n", "lastName":"n",
                //        "userEmail": "n@n.com", "userRole":"4443TLW53IFBUFCHC4FFZW9M6ZQPTEOQ",
                //            "storeIds": ["5D8B2DED97894183927020E4CCB0700E", "B3696D2623FC4D58AF11031C04276C41", "4198FCA03EF74AEEA076F78D27DC12E7"]
                //}
                let userObject = data.data;
                this.state.uuid = uuid
                this.state.userEmail = userObject.userEmail
                this.state.firstName = userObject.firstName
                this.state.lastName = userObject.lastName
                this.state.isActive = userObject.isActive
                this.state.userRole = userObject.userRole
                const keys = this.findMatchedIds(this.state.treeData, item => {
                    return (
                        item.Type === "store" &&
                        userObject.storeIds.indexOf(item.StoreUid.toString()) > -1
                    );
                })
                this.state.defaultCheckedKeys= keys.map(String)
                this.state.user = data.data;
                this.setState(this.state)
            })
        }
        else {
            this.setState({ isEdit: false })
        }
        let url = Config.apiBaseUrl + CommonConstants.apiUrls.getUserRoles
        this.api.getData(url, data => {
            this.state.roles = data.data
         //   this.state.userRole = _.pluck(_.where(this.state.roles, { 'Role_IsDefault': 1 }), 'Role_UID')[0]
            this.setState(this.state)
        })
        url = Config.apiBaseUrl + CommonConstants.apiUrls.getAudit + '?uuId=' + uuid;
        this.api.getData(url, data => {
            this.state.audit = data.data
            this.setState(this.state)
        })
    }
    load(uuid) {
        let url = Config.apiBaseUrl + CommonConstants.apiUrls.getGroupHierarchyTree
        

        if (this.state.isAdmin) {
            url += '?uuid=' + uuid;
        }
        this.api.getData(url, data => {
            this.state.treeData = data.data
            console.log(this.state.treeData);
            this.setState(this.state)
        })
    }
    onCheck(checkedKeys, node) {
        //this.state.selectedList = checkedKeys;
        this.state.defaultCheckedKeys = checkedKeys;
        this.state.stores = _.pluck(_.where(_.pluck(node.checkedNodes, "props"), { type: "store" }), "className");
        let deviceUIds = _.pluck(_.where(_.pluck(node.checkedNodes, "props"), { type: "store" }), "value");
        this.state.deviceUIds = deviceUIds;
        this.setState(this.state);
        console.log(this.state)
    }



    render() {
        const language = this.state.currentLanguage
        const user = this.state;
        const loop = data => {
            if (data) {
                return data.map(item => {
                    if (item.Children && item.Children.length) {
                        return (
                            <TreeNode title={this.renderStoresAndBrand(item)} className={item.StoreUid} key={item.Id} value={item.Type == 'store' ? item.DeviceUID : item.Id} type={item.Type}>
                                {loop(item.Children)}
                            </TreeNode>
                        );
                    }
                    return <TreeNode title={this.renderStoresAndBrand(item)} className={item.StoreUid} key={item.Id} value={item.Type == 'store' ? item.DeviceUID : item.Id} type={item.Type} />;
                });
            }
            else {
                return null
            }

        };
        return (<section className="editUser">
            <div id="Content">
                <div class="col1">
                    <div class="forms clear">
                        <h3>{t[language].userdetails}

                            <div className={"viewing_as view-as-user " + (this.state.isAdmin ? 'show' : 'hidden')}>
                                <span>
                                    View as

            						User <a /*href="./?pg=SettingsUsers&amp;st=masquerade&amp;email=selvendrank@nousinfo.com"*/ onClick={this.masquerade.bind(this)}><div><span class="green_id">{this.state.userEmail}</span></div></a>

                                </span>
                            </div>
                        </h3>
                        <ErrorAlert errorMessage={this.state.errorMessage} />
                        <form /*action="./?pg=SettingsUsers&amp;st=confirm&amp;uuid=PWD1L9GMR73VHJMV11RYHTSD7QTPNQG6" method="post" */ onsubmit={this.submit.bind(this)}>
                            <div class="fleft">
                                <table class="user_form">
                                    <tbody>
                                        <tr>
                                            <th class="req"><label for="userEmail">{t[language].usernameemail}</label></th>
                                            <td><input type="text" name="userEmail" value={user.userEmail} onChange={this.handleOnChange.bind(this)} /></td>
                                            <td>
                                                <div className={this.state.isAdmin  /*&& !this.state.isEdit*/ ? 'hidden' : 'show'}>
                                                    &nbsp;|&nbsp;<a class="cancel_butt" id="remove" onClick={this.deleteUser.bind(this)} /*href="./?pg=SettingsUsers&amp;st=delete&amp;uuid=PWD1L9GMR73VHJMV11RYHTSD7QTPNQG6"*/ >{t[language].removeuser}</a>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th class="req"><label for="firstName">{t[language].firstname}</label></th>
                                            <td><input type="text" maxlength="100" name="firstName" value={user.firstName} onChange={this.handleOnChange.bind(this)} /></td>
                                        </tr>
                                        <tr>
                                            <th class="req"><label for="lastName">{t[language].lastname}</label></th>
                                            <td><input type="text" maxlength="100" name="lastName" value={user.lastName} onChange={this.handleOnChange.bind(this)} /></td>
                                        </tr>
                                        <tr>
                                            <th class="req"><label for="isActive">{t[language].status}</label></th>
                                            <td>
                                                <input type="radio" name="isActive" value={1} checked={this.state.isActive == 1} onClick={this.handleRadioChange.bind(this)} />
                                                <span id="active_inactive"><span>{t[language].Active}</span>&nbsp;&nbsp;
                                                <input type="radio" name="isActive" value={0} checked={this.state.isActive == 0} onClick={this.handleRadioChange.bind(this)} /><span>{t[language].Inactive}</span></span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="fright">
                                <table class="user_form">
                                    <tbody>
                                        <tr>
                                            <th class="req"><label for="Role_UID" translate="" key="userrole">{t[language].userrole}</label></th>
                                            <td>
                                                <select name="userRole" class="wide_select" value={this.state.userRole} onChange={this.handleOnChange.bind(this)}>
                                                    <option value='' selected={!this.state.userRole}></option>
                                                    {this.renderOptions()}
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th class="req multi_select"><label for="Store_UID" >{t[language].storeaccess}</label>
                                                <br />
                                                <span class="select_all">{t[language].selectallapply}</span></th>
                                            <td>
                                                <div class="form_cbox">
                                                    <Tree
                                                        className="myCls"
                                                        showIcon={false}
                                                        showLine
                                                        checkable
                                                        selectable={false}
                                                        defaultSelectedKeys={this.state.defaultSelectedKeys}
                                                        defaultCheckedKeys={this.state.defaultCheckedKeys}
                                                        onSelect={this.onSelect}
                                                        onCheck={this.onCheck.bind(this)}
                                                        checkedKeys={this.state.defaultCheckedKeys}
                                                    >
                                                        {loop(this.state.treeData)}
                                                    </Tree>

                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <td colspan="6">
                                                <div class="select_deselect"><a onClick={this.selectAll.bind(this)} class="cancel_butt" id="select">{t[language].selectall}</a><span>&nbsp;|&nbsp;</span><a class="cancel_butt" onClick={this.deSelectAll.bind(this)} id="select-none">{t[language].deselectall}</a></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="remove_button">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <input type="button" value={t[language].save} onClick={this.submit.bind(this)} />
                                            </td>
                                            <td>
                                                &nbsp;|&nbsp;<a class="cancel_butt" href="./?pg=SettingsUsers">{t[language].cancel}</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


            <div className={"ctable " + (this.state.isAdmin ? 'show' : 'hidden')}>
                <table class="tablesorter tablesorter-default" id="myTable">
                    <caption /*style="font-size:16px; font-weight:600;"*/>User Activity Log</caption>
                    <thead>
                        <tr class="theader clear tablesorter-headerRow">

                            <th data-column="0" class="tablesorter-header dateTime" tabindex="0" unselectable="on"><div class="tablesorter-header-inner"><a>Date/Time</a></div></th>
                            <th data-column="1" class="tablesorter-header page" tabindex="0" unselectable="on"><div class="tablesorter-header-inner"><a>Page</a></div></th>
                            <th data-column="2" class="tablesorter-header action" tabindex="0" unselectable="on"><div class="tablesorter-header-inner"><a>Action</a></div></th>
                            <th data-column="3" class="tablesorter-header record" tabindex="0" unselectable="on"><div class="tablesorter-header-inner"><a>Record</a></div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderAudit()}
                    </tbody>
                </table>
            </div>
        </section>)
    }


    renderOptions() {
        let roles = this.state.roles;
        console.log(roles);
        //let isEdit = this.state.isEdit
        if (roles) {
            let roleOptions = roles.map(function (role, index) {
                //                return (<option key={index} value={role.Role_UID} selected={!this.state.isEdit ? (role.Role_IsDefault == 1 ? true : false) : (role.Role_UID == this.state.userRole ? true : false)} >{role.Role_Name}</option>)

              
                if (role.Role_IsDefault == 1) {
                    this.state.userRole = role.Role_UID;
                    this.setState(this.state);
                    console.log(this.state)
                }
                return (<option key={index} value={role.Role_UID} selected={(role.Role_IsDefault == 1 ? true : false)} >{role.Role_Name}</option>)


            });
            return roleOptions;
        }
    }
    renderAudit() {
        let audits = this.state.audit;
        //let isEdit = this.state.isEdit
        if (audits) {
            let roleOptions = audits.map(function (audit, index) {
                //                return (<option key={index} value={role.Role_UID} selected={!this.state.isEdit ? (role.Role_IsDefault == 1 ? true : false) : (role.Role_UID == this.state.userRole ? true : false)} >{role.Role_Name}</option>)
                return (
                    <tr key={index} class="tdata clear">
                        <td>{audit.lastLogin}</td>
                        <td>{audit.page}</td>
                        <td /*style="text-transform: capitalize;"*/>{audit.action}</td>
                        <td>{audit.record}</td>
                    </tr>
                )

            });
            return roleOptions;
        }
    }

    handleOnChange(e) {
        const { name, value } = e.target;
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleRadioChange(e) {
        this.state.isActive = this.state.isActive == 1 ? 0 : 1;
        this.setState(this.state);
    }

    renderStoresAndBrand(item) {
        return (<div className="storeTree"><span className="StoreTitile">{item.Name ? (item.StoreNumber ? item.StoreNumber + '-' : '') + item.Name : item.StoreNumber ? item.StoreNumber : ''}</span> <span className="StoreBrand">{item.Brand ? item.Brand : ''}</span> </div>)
    }
    selectAll(e) {

        if (!this.state.selectAll) {
            console.log(_.pluck(this.state.treeData, "Id").map(String));
            this.setState({
                defaultCheckedKeys: _.pluck(this.state.treeData, "Id").map(String),
                stores: this.findMatchedClassName(this.state.treeData, item => {
                    return item.Type === "store";
                }),
                selectedList: this.findMatchedIds(this.state.treeData, item => {
                    return true;
                }),
                deviceUIds: this.findMatchedIds(this.state.treeData, item => {
                    return item.Type === "store";
                })
            });
            this.setState({
                selectAll: true
            });
        }
    }
    deSelectAll(e) {
        if (this.state.selectAll) {
            this.setState({ disableIncludes: false })
            this.setState({
                defaultCheckedKeys: [],
                selectedList: []
            });
            this.setState({
                selectAll: false
            });
        }
    }


    findMatchedClassName(list, keys) {
        let selectedItems = [];
        let selectedList = [];
        let findStore = function (items) {
            items.map(item => {
                if (item.Children && item.Children.length) {
                    findStore(item.Children);
                }
                if (keys(item)) {
                    // if ( item.Type === 'store' && keys.indexOf(item.Id.toString()) > -1) {
                    selectedItems.push(item.StoreUid);
                    selectedList.push(item.Id);
                }
            });
        };

        findStore(list);
        this.setState({
            selectedList: selectedList
        });
        return selectedItems;
    }


    findMatchedIds(list, keys) {
        let selectedList = [];
        let findStore = function (items) {
            items.map(item => {
                if (item.Children && item.Children.length) {
                    findStore(item.Children);
                }
                if (keys(item)) {
                    selectedList.push(item.Id);
                }
            });
        };

        findStore(list);
        return selectedList;
    }


    deleteUser() {
        confirmAlert({
            title: this.state.deleteAlertTitle,
            message: this.state.confirmDeleteMessage,
            buttons: [
                {
                    label: this.state.deleteConfirm,
                    onClick: () => {
                        this.confirmDelete()
                    }
                },
                {
                    label: this.state.deleteCancel,
                    onClick: () => {

                    }
                }
            ]
        })
    }

    confirmDelete() {
        if (this.state.isEdit && this.state.user.uuId) {
            let url = Config.apiBaseUrl + CommonConstants.apiUrls.deleteUser + '?uuId=' + this.state.user.uuId
            this.api.deleteData(url, data => {
                if (data) {
                this.props.history.push("/message", data.key);
                //    this.state.successMessage = this.state.deleteSuceessMessage
                //    this.state.errorMessage = ''
                //    this.state.deleteSuccess = true
                //    this.setState(this.state)
                } 
                    else {
                    this.state.errorMessage = this.state.deleteErrorMessage
                    this.state.successMessage = ''
                    this.setState(this.state)
                }
            }, error => {
                this.state.errorMessage = error.message
                this.state.successMessage = ''
                this.setState(this.state)
            })
        }
    }


    masquerade(e) {
        
        let user = this.authService.getProfile();
        let userName = user.name ? user.name : user.User_FirstName + ' ' + user.User_LastName;
        let url = Config.coldFusionUrl + "?atoken=" + this.authService.getIdToken() + "&memail=" + this.state.userEmail + "&un=" + userName
        window.location.href = url;

        // let user = {
        //     username: this.state.userEmail
        // }
        // let url = Config.authBaseUrl + Config.tokenPath
        // this.api.postData(url, user, data => {
        //     if (data && data.accessToken) {
        //         this.authService.setToken(data.accessToken, false)
        //         let user = this.authService.getProfile();
        //         let userName = user.name ? user.name : user.User_FirstName + ' ' + user.User_LastName;
        //         let url = Config.coldFusionUrl + "?atoken=" + this.authService.getIdToken() + "&memail=" + user.User_EmailAddress + "&un=" + userName
        //         window.location.href = url;
        //     }
        // }, error => {
        // })
    }

    submit(e) {

        let isError = false;
        const language = this.state.currentLanguage
        if (!this.state.firstName) {
            this.state.errorMessage = t[language].pleasefillinfirstname
            isError = true;
        }
        if (!this.state.lastName) {
            this.state.errorMessage = t[language].pleasefillinlastname
            isError = true;
        }
        if (!this.state.userEmail) {
            this.state.errorMessage = t[language].emailinvalid
            isError = true;
        }
        if (!this.state.userRole) {
            this.state.errorMessage = t[language].pleaseassignrole
            isError = true;
        }

        this.setState(this.state);
        if (!isError) {
            let User = [{
                "uuId": this.state.uuid ? this.state.uuid : null,
                "firstName": this.state.firstName,
                "lastName": this.state.lastName,
                "userEmail": this.state.userEmail,
                "isActive": this.state.isActive,
                "userRole": this.state.userRole,
                "storeIds": this.state.stores ? this.state.stores : [],
                "createdDateTime": moment().format("YYYY-MM-DD HH:mm:ss")
            }]
            console.log(User[0])
            let url = Config.apiBaseUrl + CommonConstants.apiUrls.createUser
            this.api.postData(url, User[0], data => {
                
                if (data.status) {
                    // const language = this.state.currentLanguage
                    this.props.history.push("/message", data.key);
                    //this.state.successMessage = t[language][data.key];
                    //this.state.errorMessage = "";
                    //this.setState(this.state);
                }
                else if (!data.status) {
                    this.state.errorMessage = "ERROR";
                    this.state.successMessage = "";
                    this.setState(this.state);
                }
            }, error => {
                this.state.errorMessage = "ERROR";
                this.state.successMessage = "";
                this.setState(this.state);
            })
        }
    }
}



export default User
