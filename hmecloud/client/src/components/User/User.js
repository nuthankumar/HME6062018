import React, { Component } from 'react'
import './User.css'
import t from '../Language/language'
import GroupHierarchy from "../Group/GroupHierarchy";
import * as languageSettings from '../Language/languageSettings'

class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage(),
        }
    }

    render() {
        const language = this.state.currentLanguage
        return (<section className="editUser">
            <div id="Content">
                <div class="col1">
                    <div class="forms clear">
                        <h3 translate="" key="userdetails">User Details</h3>
                        <form action="./?pg=SettingsUsers&amp;st=confirm&amp;uuid=PWD1L9GMR73VHJMV11RYHTSD7QTPNQG6" method="post" onsubmit="Store_Submit()">
                            <div class="fleft">
                                <table class="user_form">
                                    <tbody>
                                        <tr>
                                            <th class="req"><label for="User_EmailAddress" translate="" key="usernameemail">Username(Email Address):</label></th>
                                            <td><input type="text" name="User_EmailAddress" value="mohanrk.mohanrk222@gmail.com" /></td>
                                            <td>
                                                <div>
                                                    &nbsp;|&nbsp;<a class="cancel_butt" id="remove" href="./?pg=SettingsUsers&amp;st=delete&amp;uuid=PWD1L9GMR73VHJMV11RYHTSD7QTPNQG6" translate="" key="removeuser">Remove User</a>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th class="req"><label for="User_FirstName" translate="" key="firstname">First Name:</label></th>
                                            <td><input type="text" maxlength="100" name="User_FirstName" value="Mohan" /></td>
                                        </tr>
                                        <tr>
                                            <th class="req"><label for="User_LastName" translate="" key="lastname">Last Name:</label></th>
                                            <td><input type="text" maxlength="100" name="User_LastName" value="Ramkumar" /></td>
                                        </tr>
                                        <tr>
                                            <th class="req"><label for="User_IsActive" translate="" key="status">Status:</label></th>
                                            <td>
                                                <input type="radio" name="User_IsActive" value="1" checked="checked" />
                                                <span id="active_inactive"><span translate="" key="Active">Active</span>&nbsp;&nbsp;
                                                    <input type="radio" name="User_IsActive" value="0" /><span translate="" key="Inactive">Inactive</span></span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="fright">
                                <table class="user_form">
                                    <tbody>
                                        <tr>
                                            <th class="req"><label for="Role_UID" translate="" key="userrole">User Role:</label></th>
                                            <td>
                                                <select name="Role_UID" class="wide_select">
                                                    <option value="FMFQ5OIM0W2SUBKHY1KPEIUK0Q6HX4FL">Company Admin</option>
                                                    <option value="4KHAEO4K3PTBQILH7PDBVQ4LF5BYOHZ2">District Manager</option>
                                                    <option value="4443TLW53IFBUFCHC4FFZW9M6ZQPTEOQ">Regional Manager</option>
                                                    <option value="CHBUS9OB1BEKMSL9JG98Q6PX2TCP2IT0" selected="selected">Store Manager</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th class="req multi_select"><label for="Store_UID" translate="" key="storeaccess">Store Access:</label><span class="select_all" translate="" key="selectallapply">Select all that apply</span></th>
                                            <td>
                                                <div class="form_cbox">
                                                    <GroupHierarchy />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <td colspan="6">
                                                <div class="select_deselect"><a class="cancel_butt" id="select" translate="" key="selectall">Select All</a>{/*<span style="font-size:16px;">&nbsp;|&nbsp;</span>*/}<a class="cancel_butt" id="select-none" translate="" key="deselectall">Deselect All</a></div>
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
                                                <input type="hidden" name="User_UID" value="PWD1L9GMR73VHJMV11RYHTSD7QTPNQG6" />
                                                <input type="submit" value="Save" translate="" key="save" />
                                            </td>
                                            <td>
                                                &nbsp;|&nbsp;<a class="cancel_butt" href="./?pg=SettingsUsers" translate="" key="cancel">Cancel</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>)
    }


}

export default User
