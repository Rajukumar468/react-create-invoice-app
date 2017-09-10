import React, { Component } from 'react';
import { Button, PageHeader } from 'react-bootstrap';
class Header extends Component {
  render(){
        return(
            <div className="row header-content text-center">
            <h2 className="info">{this.props.title}</h2>
            </div>
        )
    }
}

export default Header;