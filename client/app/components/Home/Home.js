import React, { Component } from 'react';
import { Button } from 'reactstrap';
import 'whatwg-fetch';
import {
  getFromStorage,
  setInStorage
} from '../../utils/storage';

import {
  withRouter
} from 'react-router-dom';

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
      timerName: 'New Timer',
      timerLength: 60,
      timers: []
    };

    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this)
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this)
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this)
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this)
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this)
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this)
    this.onTextboxChangeTimerName = this.onTextboxChangeTimerName.bind(this)
    this.onTextboxChangeTimerLength = this.onTextboxChangeTimerLength.bind(this)
    this.onSignIn = this.onSignIn.bind(this)
    this.onSignUp = this.onSignUp.bind(this)
    this.logout = this.logout.bind(this)
    this.addTimer = this.addTimer.bind(this)
    this.deleteTimer = this.deleteTimer.bind(this)

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

  onTextboxChangeTimerName(event) {
    this.setState({
      timerName: event.target.value,
    })
  }

  onTextboxChangeTimerLength(event) {
    this.setState({
      timerLength: event.target.value,
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
          setInStorage('the_main_app', { token: json.token })
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: '',
            signInPassword: '',
            token: json.token,
            timers: json.timers
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

  addTimer() {
      const {
        timerName,
        timerLength
      } = this.state;

      const token = JSON.parse(localStorage.the_main_app).token;

      this.setState({
        isLoading: true,
      })

      fetch(`/timer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: timerName,
          length: timerLength,
          token: token
        })
      })
        .then(res => res.json())
        .then(json => {
          if(json.success) {
            this.setState({
              signUpError: json.message,
              isLoading: false,
              timerName: 'New Timer',
              timerLength: 60,
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

  deleteTimer(id) {
    const obj = getFromStorage('the_main_app');
    fetch(`/timer?timerId=${id}&token=${obj.token}`, {
      method: 'DELETE',
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
        <div>
          <p>Account</p>
          <button onClick={this.logout}>Logout</button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Timer Name"
            value={this.state.timerName}
            onChange={this.onTextboxChangeTimerName}
          />
        <br/>
          <input
            type="text"
            placeholder="Minutes"
            value={this.state.timerLength}
            onChange={this.onTextboxChangeTimerLength}
          />
        <br/>
          <button onClick={this.addTimer}>Add Timer</button>

        </div>
        <div>
          <div>
            {this.state.timers.map(i => {
              return (
                <p key={i._id}>{i.name}, {i.length} Secs
                  <button onClick={() => {this.deleteTimer(i._id)}}> Delete</button>
                </p>
              )
            })}
          </div>
        </div>
      </div>

    )
  }

}

export default Home;
