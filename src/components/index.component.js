import React, { Component } from 'react';
import axios from 'axios';


export default class Index extends Component {
    constructor(props){
        super(props);
        this.state = {
          studentID: '',
          studentName: '',
          studentStatus: '',
          studentMajor: '',
          studentCH:''
        };
    
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleChangeID = this._handleChangeID.bind(this);
        this._handleChangeName = this._handleChangeName.bind(this);
        this._handleChangeStatus = this._handleChangeStatus.bind(this);
        this._handleChangeMajor = this._handleChangeMajor.bind(this);
        this._handleChangeCH = this._handleChangeCH.bind(this);
    }
    
    // Change state of input field so text is updated while typing
    _handleChangeID(e) {
        this.setState({
            studentID: e.target.value,
        });
    }

    // Change state of input field so text is updated while typing
    _handleChangeName(e) {
        this.setState({
            studentName: e.target.value,
        });
    }

    // Change state of input field so text is updated while typing
    _handleChangeStatus(e) {
        this.setState({
            studentStatus: e.target.value,
        });
    }

    // Change state of input field so text is updated while typing
    _handleChangeMajor(e) {
        this.setState({
            studentMajor: e.target.value,
        });
    }

    // Change state of input field so text is updated while typing
    _handleChangeCH(e) {
        this.setState({
            studentCH: e.target.value,
        });
    }

    _handleSubmit  = (event) => {
        console.log(this.state);
        event.preventDefault();
        axios.post('http://localhost:5000/test/result',this.state).
        then( response => {
            console.log(response)
            this.setState({message:"User created successfuly."})
        }).catch( error => {
            console.log(error)
        })
    }
    
  
    render() {
        return (
            <div className="contact">
                <form className="form" onSubmit={this._handleSubmit} id="formContact">
                
                <label>
                    Student Name:
                    <input type="text" id="student" name ="student" value={this.state.studentName} onChange={this._handleChangeName} required/><br/>
                    Student ID:
                    <input type="text" id="studentid" name="studentid" value={this.state.studentID} onChange={this._handleChangeID} required/><br/>
                    Student Status:
                    <select value={this.state.studentStatus} onChange={this._handleChangeStatus} required>
                        <option value="freshman">Freshman</option>
                        <option value="sophomore">Sophomore</option>
                        <option value="junior">Junior</option>
                        <option value="senior">Senior</option>
                    </select><br/>
                    Student Major:
                    <select name="major" value={this.state.studentMajor} onChange={this._handleChangeMajor} required>
                        <option value ="cs">Computer Sciences</option>
                        <option value ="ee">Electrical Engineering</option>
                        <option value ="math">Math</option>
                        <option value ="econ">Economics</option>
                    </select><br/>
                    Course History: 
                    <textarea rows="5" cols="30" placeholder="Example: 
                    CS 157C
                    CS 100W" 
                    name="History" value={this.state.studentCH} onChange={this._handleChangeCH}></textarea>
                </label>
                <br/>
                <input type="submit" value="Find course Plan" />
            </form>
            </div>
            
            
        );
    }
}

