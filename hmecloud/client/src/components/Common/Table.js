import React, { Component } from 'react'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import './Stores.css'

class Table extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        debugger
        let rows = this.props.data.map((data, index) => {
            let row = data.items.map((r, index) => {

                return <PersonRow key={
                    index
                } data={r} rowClicked={this.props.rowClicked}
                />
            })
            return row
        })
        let Header = this.props.header.map((data, index) => {
            console.log(data, index)
            return (
                <tr key={index}>
                    <th className="merge_device_name">
                        {data}
                    </th>
                </tr>
            )
        })
        return (
            <table >
                <thead>
                    {Header}
                </thead>
                < tbody >
                    {rows}
                </tbody>
            </table>)
    }
}

const PersonRow = (props) => {
    return (
        <tr>
            <td>
                <input type="checkbox" name="sys-merge-check" id="d86c4874-60af-4777-8363-f40fa2ca356a" class="sys-merge-check" onchange={this.props.rowClicked(this.props.value)} />
            </td>
            <td>
                {props.data.Settings}
            </td>
            <td>
                {props.data.Value}
            </td>
        </tr>
    );
}

export default Table;