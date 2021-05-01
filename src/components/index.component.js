import React, { Component } from 'react';


export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
      handleChange(event) {
        this.setState({value: event.target.value});
      }
    
      handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
      }

    render() {
        return (
            <form action="result.html" method="post">
                
                <label>
                    Student Name:
                    <input type="text" id="student" name ="student"/><br/>
                    Student ID:
                    <input type="text" id="studentid" name="studentid"/><br/>
                    Student Status:
                    <select>
                        <option value="freshman">Freshman</option>
                        <option value="sophomore">Sophomore</option>
                        <option value="junior">Junior</option>
                        <option value="senior">Senior</option>
                    </select><br/>
                    Student Major:
                    <select name="major">
                        <option value ="cs">Computer Sciences</option>
                        <option value ="ee">Electrical Engineering</option>
                        <option value ="math">Math</option>
                        <option value ="econ">Economics</option>
                    </select><br/>
                    Course History: 
                    <textarea rows="5" cols="30" placeholder="Example: 
                    CS 157C
                    CS 100W" 
                    name="History"></textarea>
                </label>
                <br/>
                <input type="submit" value="Find course Plan" />
            </form>
            
        );
    }
}

