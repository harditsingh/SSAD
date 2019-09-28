import React, { Component } from 'react';
import 'reactstrap';

class Form extends Component {
  constructor(props){
    super(props);
    this.state = {
      emergency: 'checked',
      rNE: '',
      firefighting: '',
      gLC: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this);

  }

  handleChange(event) {
    this.props.onChange(event.target.name,event.target.value)
  }

  handleRadioButtonChange(event){
    this.props.onRadioButtonChange(event.target.value);
    const name = event.target.name;
    if(event.target.type == "radio")
    {
      this.setState({
        emergency: '',
        rNE:'',
        firefighting:'',
        gLC:'',
        [name]: 'checked'
      });
    }
  }

  handleSubmit(event) {
    this.props.onSubmit();
  }

  render() {
    const form_length = {
      width : 400
    }
    return (
      <div className="row justify-content-center">
      <form onSubmit={this.handleSubmit}>
      <div className="form-group">
        <label>
          Name
          <input className="form-control" name="name" type="text" value={this.props.name} onChange={this.handleChange} style={form_length}/>
        </label>
      </div>
      <div className="form-group">
        <label>
          Phone Number
          <input className="form-control" name="phoneNumber" type="text" value={this.props.phoneNumber} onChange={this.handleChange} style={form_length}/>
          </label>
      </div>
      <div className="form-group">
        <label>
          Location
          <input className="form-control" name="location" type="text" value={this.props.location} onChange={this.handleChange} style={form_length}/>
          </label>
      </div>
      <div className="form-group" onChange={this.handleRadioButtonChange}>
      Type of Assistance Requested

      <div className="form-check">
      <input className="form-check-input" type="radio" name="emergency" value="Emergency Ambulance" checked={this.state.emergency}/> Emergency Ambulance
      </div>

      <div className="form-check">
      <input className="form-check-input" type="radio" name="rNE" value="Rescue and Evacuation" checked={this.state.rNE}/> Rescue and Evacuation
      </div>

      <div className="form-check">
      <input className="form-check-input" type="radio" name="firefighting" value="Fire Fighting" checked={this.state.firefighting}/> Fire Fighting
      </div>

      <div className="form-check">
      <input className="form-check-input" type="radio" name="gLC" value="Gas Leak Control" checked={this.state.gLC}/> Gas Leak Control
      </div>

      </div>

      <input className="btn btn-primary" type="submit" value="Submit" />
      </form>
      </div>
    );
  }
}

export default Form;
