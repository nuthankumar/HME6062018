import React, { Component } from 'react';
import './Stores.css'

import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

const Online = require("../../images/connection_online.png");
const Offline = require("../../images/connection_offline.png");


//export default class BookList extends Component {
class StoreDetail extends Component { //ensure you dont export component directly
    
    constructor (props) {
        super(props)
        this.state = {
          showStores: this.props.showStores,
        }
      }

    render() {
        console.log(this.props.showStores);
        return (
            <section className={"stores "+ (this.state.showStores? 'show':'hidden')}>
<div className="settings forms">
     <div class="settings_list">
				<div class="storesTable ctable">
					<table>
						<tbody><tr class="theader clear">
							<th></th>
							<th class="actcold"><a href="./?pg=SettingsStores&amp;sort=cnamed&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Company Name</a></th>
							<th><a href="./?pg=SettingsStores&amp;sort=bbrand&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Brand</a></th>
							<th><a href="./?pg=SettingsStores&amp;sort=sstord&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Store #</a></th>
							<th><a href="./?pg=SettingsStores&amp;sort=sstord&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Store Name</a></th>
							<th><a href="./?pg=SettingsStores&amp;sort=saddrd&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Store Address</a></th>
							{/* style="width:100px;" */}
                            <th ><a href="./?pg=SettingsStores&amp;sort=dserd&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Serial #</a></th>
							
							{/* style="width:80px;" */}
							<th ><a href="./?pg=SettingsStores&amp;sort=sfirmd&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Version</a></th>
							<th><a href="./?pg=SettingsStores&amp;sort=subscd&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Subscription</a></th>
							<th><a href="./?pg=SettingsStores&amp;sort=cstatd&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Status</a></th>
						</tr> 
						<tr class="tdata clear">
							
                            <td class="cdet store_checkbox"><input type="checkbox" name="edit_selected1" id="edit_selected1" onchange="addRemoveStores('F5EE2F75C7CE4725849E4B5626A888D9','1');" value="F5EE2F75C7CE4725849E4B5626A888D9" disabled="disabled"/></td>
                            <td>#19622 <br/><span class="edit_settings"><a href="#" class="opener view_details" onclick="passViewDetails('F5EE2F75C7CE4725849E4B5626A888D9','', '00000159', 'shomhme+serversplit19622@gmail.com', 'Wendy\'s', 'ZOOM');">View Details</a></span></td>
                            <td>Wendy's</td>
							<td>00000159</td>
							<td></td>
							<td>14110 Stowe Dr </td>
                            <td colspan="4">
                            	<table>
									
                                        <tbody><tr>
                                            <td>00000159</td>
                                            <td>2.31.7.999</td>
                                            <td>PremiumPlus</td>
                                            <td>
                                            	<img src={Online}class="cstat on_img_margin" alt="Device Offline"/><span class="cstat"><p class="device_loc">
                                                {/* style="font-size:12px;" */}
                                                <span >ZOOM</span><br/>Offline</p></span>
                                            </td>
                                        </tr>
                                    
                                </tbody></table>
                            </td>
						</tr>
						<tr class="tdata clear">
							
                            <td class="cdet store_checkbox"><input type="checkbox" name="edit_selected2" id="edit_selected2" onchange="addRemoveStores('16BF6116E3A643CFBC8790B74CB63421','2');" value="16BF6116E3A643CFBC8790B74CB63421" disabled="disabled"/></td>
                            <td>Azure 500 Err T <a href="javascript:void(0);" long-desc="Azure 500 Err Test">...</a><br/><span class="edit_settings"><a href="#" class="opener view_details" onclick="passViewDetails('16BF6116E3A643CFBC8790B74CB63421','', '00000159', 'dmattox@hme.com', 'Wendy\'s', 'ZOOM');">View Details</a></span></td>
                            <td>Wendy's</td>
							<td>00000159</td>
							<td></td>
							<td> </td>
                            <td colspan="4">
                            	<table>
									
                                        <tbody><tr>
                                        {/* style="width:100px;" */}
                                            <td >00000159</td>
                                            {/* style="width:80px;" */}
                                            <td>2.31.7.999</td>
                                            {/* style="width:100px;" */}
                                            <td>PremiumPlus</td>
                                            <td>
                                            	<img src={Offline} class="cstat on_img_margin" alt="Device Offline"/><span class="cstat"><p class="device_loc"><span>ZOOM</span><br/>Offline</p></span>
                                            </td>
                                        </tr>
                                    
                                </tbody></table>
                            </td>
						</tr>
						<tr class="tdata clear">
							
                            <td class="cdet store_checkbox"><input type="checkbox" name="edit_selected3" id="edit_selected3" onchange="addRemoveStores('95083E4862B34034BD0A2A8167D648D5','3');" value="95083E4862B34034BD0A2A8167D648D5" disabled="disabled"/></td>
                            <td>Load Testing In <a href="javascript:void(0);" long-desc="Load Testing Inc.">...</a><br/><span class="edit_settings"><a href="#" class="opener view_details" onclick="passViewDetails('95083E4862B34034BD0A2A8167D648D5','', '00000159', 'hmeloadtest@gmail.com', 'Wendy\'s', 'ZOOM');">View Details</a></span></td>
                            <td>Wendy's</td>
							<td>00000159</td>
							<td></td>
							<td> </td>
                            <td colspan="4">
                            	<table>
									    <tbody><tr>
                                            <td>00000159</td>
                                            <td>2.31.7.999</td>
                                            <td>BasicPlus</td>
                                            <td>
                                            	<img src={Online} class="cstat on_img_margin" alt="Device Offline"/><span class="cstat"><p class="device_loc"><span>ZOOM</span><br/>Offline</p></span>
                                            </td>
                                        </tr>
                                </tbody></table>
                            </td>
						</tr>
						
						<tr class="tdata clear">
							
                            <td class="cdet store_checkbox"><input type="checkbox" name="edit_selected9" id="edit_selected9" onchange="addRemoveStores('D86AB8F8458C4C15A3138236486DC8CA','9');" value="D86AB8F8458C4C15A3138236486DC8CA" disabled="disabled"/></td>
                            <td>Test that CIB a <a href="javascript:void(0);" long-desc="Test that CIB again in UAT!">...</a><br/><span class="edit_settings"><a href="#" class="opener view_details" onclick="passViewDetails('D86AB8F8458C4C15A3138236486DC8CA','', '00000159', 'tpstorytester+300@gmail.com', 'McDonald\'s', 'ZOOM');">View Details</a></span></td>
                            <td>McDonald's</td>
							<td>00000159</td>
							<td></td>
							 <td> </td>
                         {/*  style="padding-left:0px;" */}
                            <td colspan="4" >
                            	<table>
									
                                        <tbody><tr>
                                            <td>00000159</td>
                                            <td>2.31.7.999</td>
                                            <td>PremiumPlus</td>
                                            <td>
                                                <img src={Online} class="cstat on_img_margin" alt="Device Offline"/><span class="cstat"><p class="device_loc"><span >ZOOM</span><br/>Offline</p></span>
                                            </td>
                                        </tr>
                                    
                                </tbody></table>
                            </td>
						</tr>
					</tbody></table>
				</div>
				<div class="per_page_cont">
						<span class="per_page">
							Show 
							<select id="per_show">
								<option value="10">10&nbsp;</option>
								<option value="25">25&nbsp;</option>
								<option value="50">50&nbsp;</option>
								<option value="10000">All&nbsp;</option>
							</select>
							items per page
						</span>
					</div>
                    {/* style="width:925px;" */}
				<div class="cloud_pagination" >
					<div class="pagination">&nbsp;</div>
				</div>
				<span class="results">Showing 1 - 9 of (9) Results</span>
		  	</div>
          </div>


            </section>



        );
    }
}

export default StoreDetail;

















