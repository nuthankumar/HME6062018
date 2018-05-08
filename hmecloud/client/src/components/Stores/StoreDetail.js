import React, { Component } from 'react';
//export default class BookList extends Component {
class StoreDetail extends Component { //ensure you dont export component directly
    render() {
        return (
            <ul className="list-group col-sm-4">
               {/* { {this.renderList()} }*/}
                <h1> Stores </h1> 
            </ul>
        );
    }
}

export default StoreDetail;

















