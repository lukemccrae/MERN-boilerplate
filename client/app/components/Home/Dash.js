import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  logout,
  getFromStorage
} from '../../utils/storage';

class Dash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: 'JSON.parse(localStorage.the_main_app).token',
      isLoading: false
    }

    this.logout = this.logout.bind(this)
    console.log(this.state);

  }

  logout() {
    console.log('hi');
    this.setState({
      isLoading: true
    })
    const obj = getFromStorage('the_main_app');
    if(obj && obj.token) {
      //verify token
      fetch('/api/account/logout?token=' + obj.token)
        .then(res => res.json())
        .then(json => {
          if(json.success) {
            this.setState({
              token: '',
              isLoading: false
            })
            // this.props.history.push('/')
            console.log(this.state)
            localStorage.clear();
          } else {
            this.setState({
              isLoading: false
            })
          }
        });
    } else {
      this.setState({
        isLoading: false,
      })
    }
  }
  render() {
    return (
      <div>
        <p>Account</p>
        <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
}

export default Dash;
