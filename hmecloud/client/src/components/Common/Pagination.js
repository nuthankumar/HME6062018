import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';


class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 10,
      offset:0
    }
    this.PageSizeChange = this.PageSizeChange.bind(this)
  }
  PageSizeChange(event) {
    this.setState({ value: parseInt(event.target.value) });
    this.props.PageSizeValueChange(parseInt(event.target.value));
  }
  OnPageChange = (data) => {
    let self=this
    let selected = data.selected;
    let offset = Math.ceil(selected * self.state.value);
    // this.state.offset=offset;
    this.setState({offset})
    this.props.offset(offset);
  };

  render() {
    return (
      <div >
        <div class="paginationSection">
          <div className="dropDown_show">
            Show <span></span>
            <select id="per_show" onChange={this.PageSizeChange} value={this.state.value}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="10000">All</option>
            </select>
            <span></span> items per page
          </div>
          <ReactPaginate previousLabel={"<<"}
            nextLabel={">>"}
            breakLabel={<a>...</a>}
            breakClassName={"break-me"}
            pageCount={this.props.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={6}
            onPageChange={this.OnPageChange}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"} />
          <span class="results">Showing {this.state.offset+1}-{this.state.value+ this.state.offset} of ({this.props.recordCount}) Results</span>
        </div>
      </div>
    );
  }
};


export default Pagination;

