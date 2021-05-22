import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './login.component';
import Logout from './logout.component';

export default class Navbar extends Component {

    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">SJSU Scheduling Helper</Link>
                <div className="collpase navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                    </ul>
                    <ul className="navbar-nav  pull-right">
                        <form className="form-inline my-2 my-lg-0">
                            <Login />
                            <Logout />
                        </form>
                    </ul>
                </div>
            </nav>
        );
    }
}
