import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  getFromStorage,
  setInStorage
} from '../../utils/storage'

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: ''
    };

    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this)
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this)
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this)
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this)
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this)
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this)
    this.onSignIn = this.onSignIn.bind(this)
    this.onSignUp = this.onSignUp.bind(this)
    this.logout = this.logout.bind(this)

    // this.newCounter = this.newCounter.bind(this);
    // this.incrementCounter = this.incrementCounter.bind(this);
    // this.decrementCounter = this.decrementCounter.bind(this);
    // this.deleteCounter = this.deleteCounter.bind(this);
    //
    // this._modifyCounter = this._modifyCounter.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    if(obj && obj.token) {
      //verify token
      fetch('/api/account/verify?token=' + obj.token)
        .then(res => res.json())
        .then(json => {
          if(json.success) {
            this.setState({
              token: obj.token,
              isLoading: false
            })
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

  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    })
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    })
  }

  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    })
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    })
  }

  onTextboxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value,
    })
  }

  onTextboxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value,
    })
  }

  onSignUp() {
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword
    } = this.state;

    this.setState({
      isLoading: true,
    })


    fetch(`/api/account/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if(json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: '',
            signUpPassword: '',
            signUpFirstName: '',
            signUpLastName: ''
          })
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false
          })
        }
      });
  }

  onSignIn() {
    const {
      signInEmail,
      signInPassword
    } = this.state;

    this.setState({
      isLoading: true,
    })
    fetch(`/api/account/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if(json.success) {
          console.log(json.token);
          setInStorage('the_main_app', { token: json.token })
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: '',
            signInPassword: '',
            token: json.token
          })
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false
          })
        }
      });
  }

  logout() {
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


  incrementCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}/increment`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyCounter(index, json);
      });
  }

  decrementCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}/decrement`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyCounter(index, json);
      });
  }

  deleteCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}`, { method: 'DELETE' })
      .then(_ => {
        this._modifyCounter(index, null);
      });
  }

  _modifyCounter(index, data) {
    let prevData = this.state.counters;

    if (data) {
      prevData[index] = data;
    } else {
      prevData.splice(index, 1);
    }

    this.setState({
      counters: prevData
    });
  }

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword
    } = this.state;

    if(isLoading) {
      return(
        <div><p>Loading</p></div>
      )
    }

    if(!this.state.token) {
      return (
        <div>
          <div>
            {
              (signInError) ? (
                <p>{signInError}</p>
              ) : (null)
            }
              <p>sign in</p>
              <input
                type="email"
                placeholder="email"
                value={signInEmail}
                onChange={this.onTextboxChangeSignInEmail}
              />
              <br/>
              <input
                type="password"
                placeholder="password"
                value={signInPassword}
                onChange={this.onTextboxChangeSignInPassword}
              />
            <br/>
            <button onClick={this.onSignIn}>Sign In</button>
              <br/>
          </div>
          <div>
              <p>sign up</p>
              <input
                type="text"
                placeholder="First Name"
                value={signUpFirstName}
                onChange={this.onTextboxChangeSignUpFirstName}
              />
              <br />
              <input
                type="text"
                placeholder="Last Name"
                value={signUpLastName}
                onChange={this.onTextboxChangeSignUpLastName}
              />
              <br />
              <input
                type="email"
                placeholder="email"
                value={signUpEmail}
                onChange={this.onTextboxChangeSignUpEmail}
              />
              <br />
              <input
                type="password"
                placeholder="password"
                value={signUpPassword}
                onChange={this.onTextboxChangeSignUpPassword}
              />
            <br/>
            <button onClick={this.onSignUp}>Sign Up</button>
              <br />
              <br />
          </div>
        </div>
      )
    }

    return (
      <div>
        <p>Account</p>
        <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
}

export default Home;
