import React, { Component } from 'react'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import './Stores.css'
import {Modal,Button} from 'react-bootstrap'; 
class StoreMerge extends Component {
    constructor(props) {
        super(props)
        this.state = {
        currentLanguage: languageSettings.getCurrentLanguage(),
            data: {},

        }
    }
    rowClicked(value) {

    }
    componentWillMount() {
        // fetch('url').then(response => res.json).then(response => {
        // })
        let data = [
            {
                items: [{
                    Settings: "Store_ID",
                    Value: 3001
                }, {
                    Settings: "Deprecated",
                    Value: 0,
                }, {
                    Settings: "Manager Code",
                    Value: 0
                }]
            }
        ]
        this.setState({ data })

    }
    render() {
        //   const language = this.state.currentLanguage
        let displayData = this.props.systemStats
       
        return (
            <Modal
                {...this.props}
                bsSize="large"
                aria-labelledby="contained-modal-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Merge</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="merge">
                        <div className="row">
                            <SelectSystem data={this.state.data} />
                            <TargetStore />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }

}
class SelectSystem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            storeNumber: "1",
            storeBrand: 'Mary'
        }
    }
    rowClicked(event){
        console.log(event)
    }
    render() {
        //  const language = this.state.currentLanguage
        let displayData = this.props.systemStats
        let headers = [' ', 'System', 'Serial Number']
        return (
            <div className="col-1-2">
                <h3>Select System(s)</h3>
                <div className="form-group">
                    <div className="merge_store_devices">
                        <div>Store Number:&nbsp;&nbsp;<span className="merge_store_num_label">{this.state.storeNumber}</span></div>
                        <div>Store Brand:&nbsp;&nbsp;<span className="merge_store_brand_label">{this.state.storeBrand}</span></div>
                    </div>
                </div>
                <div className="select-cont">
                    <Table data={this.props.data} header={headers} rowClicked={this.rowClicked.bind
                    (this)} />
                </div>
            </div>
        )
    }

}

class Table extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        debugger
        let rows = this.props.data
        if (rows) {
            rows = this.props.data.map((data, index) => {
                let row = data.items.map((r, index) => {

                    return <PersonRow key={
                        r.index
                    } data={r} rowClicked={this.props.rowClicked}
                    />
                })
                return row
            })
        }
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
            <td className="sys-merge-name sys-merge-ctr">
            <input type="checkbox" name="sys-merge-check" id="d86c4874-60af-4777-8363-f40fa2ca356a" class="sys-merge-check" onchange={this.props.rowClicked}/>
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


class TargetStore extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
        this.handleOnClick = this.handleOnClick.bind(this)
    }
    handleOnClick() {
        // fetch('url')
        let data = {};
        this.setState({ data })
    }
    render() {
        //  const language = this.state.currentLanguage
        let displayData = this.props.systemStats
        let data = this.state.data
        let headers = [' ', 'Store', 'Company', 'Brand']
        return (
            <div className="col-2-2 vert-line">
                <h3>Select Target Store</h3>
                <form className="form-inline search-box">
                    <div className="form-group">
                        <input type="text" className="form-control" id="merge_store_search" placeholder="Enter Store Number" />
                    </div>
                    <button type="button" className="btn btn-default merge_search_btn" onClick={this.handleOnClick.bind(this)}>Search</button>
                </form>
                <div className="results-cont">
                    <Table data={data} header={headers} />
                </div>
            </div>
        )
    }

}
export default StoreMerge
