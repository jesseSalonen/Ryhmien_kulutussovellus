import React, { Component } from 'react';
import './App.css';
import { Link, NavLink } from 'react-router-dom';

/*
    Create navigation menu and use Router to connect the menu items into right endpoints
*/
class Nav extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fontColor: "white",
            styleWhenActive: {
                fontWeight: "bold",
                color: "rgb(16, 58, 80)",
                backgroundColor: "white"
            }
        };
    }
    
    render () {
        return (
            <nav>
                <h3>Reissusovellus</h3>
                <ul className="nav-links">
                    {/* Setting menu items to match URLs */}
                    
                    <Link style={{ 'color': this.state.fontColor }} to='/'>
                    <li>Etusivu</li>
                    </Link>
                    
                    <NavLink style={{ 'color': this.state.fontColor }} to='/luoryhma' 
                                    activeStyle={this.state.styleWhenActive}>
                    <li>Luo ryhmä</li>
                    </NavLink>
                    
                    <NavLink style={{'color': this.state.fontColor}} to='/liityryhmaan'
                                    activeStyle={this.state.styleWhenActive}>
                    <li>Liity ryhmään</li>
                    </NavLink>
                    
                    <NavLink style={{ 'color': this.state.fontColor }} to='/tuotteet'
                                    activeStyle={this.state.styleWhenActive}>
                    <li>Tuotesivu</li>
                    </NavLink>
                </ul>
            </nav>
          );
    }

}


export default Nav;