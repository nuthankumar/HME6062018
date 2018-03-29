import React from "react";

export default class ErrorAlert extends React.Component {
  constructor() {
      super();
  }

  render(){
    if(this.props.errorMessage != "" && this.props.errorMessage != undefined){

      return(
        <div className="alert alert-danger">
          <a href="#" className="close" data-dismiss="alert">&times;</a>
          {this.props.errorMessage}
        </div>
      );
    }else{
      return(
        <div></div>
      );
    }
  }
}
