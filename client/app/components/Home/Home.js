import React, { Component } from 'react';
import { Button, Container, Row } from 'reactstrap';
import 'whatwg-fetch';
import {
  getFromStorage,
  setInStorage
} from '../../utils/storage';

import {
  withRouter
} from 'react-router-dom';
import AddTimer from '../input/AddTimer.js';
import TimerList from '../Timers/TimerList.js';
import TimerQueue from '../Timers/TimerQueue.js';

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
      signUpPassword: '',
      timers: [],
      username: '',
      countdown: ''
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
    this.editTimer = this.editTimer.bind(this)
    this.getTimers = this.getTimers.bind(this)
    this.removeTimer = this.removeTimer.bind(this)
    this.startTimers = this.startTimers.bind(this)

    // this.newCounter = this.newCounter.bind(this);
    // this.incrementCounter = this.incrementCounter.bind(this);
    // this.decrementCounter = this.decrementCounter.bind(this);
    // this.deleteCounter = this.deleteCounter.bind(this);
    //
    // this._modifyCounter = this._modifyCounter.bind(this);
  }

  //give user session to api
  //with user session, api can find userId and pass timers back to front end

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
        })
        .then(
          fetch('api/user?token=' + obj.token)
            .then(res => res.json())
            .then(json => {
              if(json.success) {
                this.setState({
                  timers: res.data
                })
              }
            })
        );
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

  startTimers() {
    var length = 0;
    for (var i = 0; i < this.state.timerQueue.length; i++) {
      length += this.state.timerQueue[i].length;
      setTimeout(function(){
        this.setState(countDown)
      }, this.state);

    }
    console.log("These timers have a collective length of " + length + " seconds.");
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
          setInStorage('the_main_app', { token: json.token })
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: '',
            signInPassword: '',
            token: json.token,
            timers: json.timers,
            username: json.user,
            groups: json.groups
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
            // this.props.history.push('/')
            // localStorage.clear();
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

  getTimers(token) {
    fetch(`/timer?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(json => {
      if(json.success) {
        this.setState({
          timers: json.timers
        })
      } else {
        this.setState({
          timerError: json.message,
          isLoading: false
        })
      }
    });
  }


  removeTimer(timer) {
    var queuedTimers = this.state.timerQueue;
    var timerPos = queuedTimers.indexOf(timer)
    if(timerPos > -1) {
      queuedTimers.splice(timerPos, 1)
    }

    this.setState({timerQueue: queuedTimers})
  }

  editTimer(id) {
    console.log("when this button is clicked, the name field becomes a text box and the edit button turns into a save");
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
            <Button color="danger" onClick={this.onSignIn}>Sign In</Button>
              <br/>
          </div>
          <div className="container">
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
      <Container>
        <Row>
          <div className="navbar">
            <p>Welcome, {this.state.username}</p>
            <Button onClick={this.logout}>Logout</Button>
          </div>
          <AddTimer getTimers={this.getTimers}></AddTimer>
          <div>
            <div>
              <p>All Timers</p>
              <TimerList getTimers={this.getTimers} groups={this.state.groups} timers={this.state.timers}></TimerList>
            </div>
            <div>

            </div>
          </div>
          <button onClick={this.startTimers}>Start</button>
        </Row>
      </Container>

    )
  }

}

export default Home;
