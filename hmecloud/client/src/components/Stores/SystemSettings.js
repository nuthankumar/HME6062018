import React, { Component } from 'react'
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
        let displayData = this.props.systemStats

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
        const values = this.props.data
        if (values) {
            let roleOptions = values.map(function (value, index) {
                return (<AccordionItem key={index}>
                    <AccordionItemTitle>
                        <h3>{value.header}</h3>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <Table data={value.items} />
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
                {props.data.Settings}
            </td>
            <td>
                {props.data.Value}
            </td>
        </tr>
    );
}



export default SystemSettings
