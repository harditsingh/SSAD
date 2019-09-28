import React, { Component } from 'react';
import './App.css';
import Form from './Form';
import 'reactstrap';
import Nav from './Nav';

class CallCenter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      phoneNumber: '',
      location: '',
      request: 'Emergency Ambulance'
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRBChange = this.handleRBChange.bind(this);
  }

  handleInputChange(name,value){
    this.setState({
      [name]:value
    });
  }

  handleSubmit(){
    alert(this.state.request);
  }

  handleRBChange(value,name){
    this.setState({
      request : value
    });
  }

  render() {
    return (
      <div className="CallCenter">
          <Nav/>
          <p className="text-center py-3" style={{fontSize: 32}}>Emergency Request Form</p>
          <Form
            name={this.state.name}
            phoneNumber={this.state.phoneNumber}
            location={this.state.location}
            onChange={this.handleInputChange}
            onRadioButtonChange = {this.handleRBChange}
            onSubmit={this.handleSubmit} />
      </div>
    );
  }
}

export default CallCenter;
