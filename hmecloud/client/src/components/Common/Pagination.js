import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';


 class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 10
    }
    this.PageSizeChange = this.PageSizeChange.bind(this)
  }
  PageSizeChange(event) {
    this.setState({ value: event.target.value });
    this.props.PageSizeValueChange(parseInt(event.target.value));
  }
  OnPageChange = (data) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.props.perPage);
    this.props.offset(offset);
  };

  render() {
    return (

      <div>
        <select id="per_show" onChange={this.PageSizeChange} value={this.state.value}>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="10000">All</option>
        </select>
        <ReactPaginate previousLabel={"<<"}
          nextLabel={">>"}
          breakLabel={<a>...</a>}
          breakClassName={"break-me"}
          pageCount={this.props.recordCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={6}
          onPageChange={this.OnPageChange}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"} />
        <span class="results">Showing 1 - 10 of ({this.props.recordCount}) Results</span>
      </div>
    );
  }
};


export default Pagination;

