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
          studentCH:'',
          prereq_resolution: []
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
        axios.post('http://localhost:5000/requirements/result',this.state).
        then( response => {
            console.log(response)
            sessionStorage.setItem("data", JSON.stringify(response.data));
            window.location.replace(`/result`)  //data=${JSON.stringify(response.data)}`);
        }).catch( error => {
            console.log(error)
        })
        
    }
    //     axios.post('http://localhost:5000/requirements/verify_course_history',this.state).
    //     then( response => {
    //         if (response.data[1].length != 0){
    //             console.log("Unresolved prerequisites found: " + response.data[1])
    //             axios.post('http://localhost:5000/requirements/get_prereq_options',response.data[1]).
    //             then( response => {
    //                 console.log("im in it")
    //                 console.log(response.data[0])
    //                 this.setState({
    //                     prereq_resolution:response.data
    //                 });

    //         })
    //     }else{
    //         console.log(response.data[0])
    //         axios.post('http://localhost:5000/requirements/result',response.data[0]).
    //         then( response => { 
    //             console.log("yo")
        
    //         }).catch( error => {
    //             console.log(error)
    //          })
    //     }
    // })
    // }
      
    render() {
        const items = JSON.stringify(this.state.prereq_resolution)
        
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
                        <option default value="">-</option>
                        <option value="freshman">Freshman</option>
                        <option value="sophomore">Sophomore</option>
                        <option value="junior">Junior</option>
                        <option value="senior">Senior</option>
                    </select><br/>
                    Student Major:
                    <select name="major" value={this.state.studentMajor} onChange={this._handleChangeMajor} required>
                        <option default value="">-</option>
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
                <p>{items}</p>
                <br/>
                <input type="submit" value="Find course Plan" />
            </form>
            
            </div>      
        );
    }
}

