import React from "react";

export default class SuccessAlert extends React.Component {
  constructor() {
      super();
  }
  render(){

      if(this.props.successMessage != "" && this.props.successMessage != undefined){

      return(
        <div className="alert alert-success alert-dismissible" role="alert">
          <a href="#" className="close" data-dismiss="alert">&times;</a>
          {this.props.successMessage}
        </div>
      );

    }else{
      return(
          <div></div>
      );

    }

  }
}
