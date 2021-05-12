import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './form.css';



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
            
            <div class="form-body">
                <div class="row">
                    <div class="form-holder">
                        <div class="form-content">
                            <div class="form-items">
                                <h3>Student information</h3>
                                <p>Fill in the data below.</p>
                                <form className="form" onSubmit={this._handleSubmit} id="formContact">
                                    <div class="col-md-12">
                                    <input class="form-control" type="text" name="student" placeholder="Student Name" onChange={this._handleChangeName} required/>
                                    <div class="valid-feedback">Student name field is valid!</div>
                                    <div class="invalid-feedback">Student name field cannot be blank!</div>
                                </div>
    
                                <div class="col-md-12">
                                    <input class="form-control" type="text" name="studentid" placeholder="Student ID" onChange={this._handleChangeID} required/>
                                     <div class="valid-feedback">Student ID field is valid!</div>
                                     <div class="invalid-feedback">Student ID  field cannot be blank!</div>
                                </div>
    
                               <div class="col-md-12">
                                    <select class="form-select mt-3" onChange={this._handleChangeStatus} required>
                                          <option selected disabled value="">Student Status</option>
                                          <option value="freshman">Freshman</option>
                                          <option value="sophomore">Sophomore</option>
                                          <option value="junior">Junior</option>
                                          <option value="senior">Senior</option>
                                   </select>
                                    <div class="valid-feedback">You selected a status!</div>
                                    <div class="invalid-feedback">Please select a status!</div>
                               </div>
                                
                                
                                <div class="col-md-12">
                                    <select class="form-select mt-3" onChange={this._handleChangeMajor} required>
                                          <option selected disabled value="">Student Major</option>
                                          <option value ="cs">Computer Sciences</option>
                                          <option value ="ee">Electrical Engineering</option>
                                          <option value ="math">Math</option>
                                          <option value ="econ">Economics</option>
                                   </select>
                                    <div class="valid-feedback">You selected a major!</div>
                                    <div class="invalid-feedback">Please select a major!</div>
                               </div>
                                
                                <div class="col-md-12">
                                    <textarea rows="5" cols="30" placeholder="Student History - one course per line" 
                        name="History" value={this.state.studentCH} onChange={this._handleChangeCH}></textarea>
                                    
                               </div>
    
    
                               
    
                            
                      
    
                                <div class="form-button mt-3">
                                    <button id="submit" type="submit" class="btn btn-primary">Find course Plan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    
            
            
        );
    }
}

