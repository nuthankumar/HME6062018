import React, { Component } from 'react'
import './Stores.css'
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'


class SystemSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage(),           
        }
    }

    render() {
        const language = this.state.currentLanguage
        return (
            <div className="system">
                <h3 className="device-header">  System Settings</h3>
                <Accordion>
                    {this.renderAccordian()}
                </Accordion>
            </div>
        )
    }

    renderAccordian() {
        debugger        
        if (this.props.data!=undefined) {
            const values = this.props.data.systemSettings
            let roleOptions = values.map(function (value, index) {
                return (<AccordionItem key={index}>
                    <AccordionItemTitle>
                        <h3>{value.name}</h3>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <Table data={value.value} />
                    </AccordionItemBody>
                </AccordionItem>)
            });
            return roleOptions;
        }
    }

}

class Table extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        let rows = this.props.data.map((person, index) => {
            return <PersonRow key={
                person.index
            } data={person}
            />
        })
        return (<table > <thead>
            <tr>
                <th>Settings</th>
                <th>Value</th>
            </tr>
        </thead>< tbody > {rows} </tbody> </table>)
    }
}

const PersonRow = (props) => {
    return (
        <tr>
            <td>
                {props.data.SettingInfo_Name}
            </td>
            <td>
                {props.data.DeviceSetting_SettingValue}
            </td>
        </tr>
    );
}

export default SystemSettings
