import React, {Component} from 'react';
import TimerQueue from './TimerQueue.js';
import SaveGroup from './SaveGroup.js';
import {
  getFromStorage,
  setInStorage
} from '../../utils/storage';

class TimerList extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      timerName: 'New Timer',
      timerLength: 60,
      isLoading: '',
      timerError: '',
      timerQueue: []
    }
    this.onTextboxChangeTimerName = this.onTextboxChangeTimerName.bind(this)
    this.onTextboxChangeTimerLength = this.onTextboxChangeTimerLength.bind(this)
    this.addTimer = this.addTimer.bind(this)
    this.queueTimer = this.queueTimer.bind(this)
    this.removeTimer = this.removeTimer.bind(this)
    this.deleteTimer = this.deleteTimer.bind(this)
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

  queueTimer(timer) {
    if(this.state.timerQueue.indexOf(timer) == -1) {
      var queuedTimers = this.state.timerQueue;
      queuedTimers.push(timer);
      this.setState({timerQueue: queuedTimers});
    } else {
      console.log('timer already in queue');
    }
  }

  removeTimer(timer) {
    let index = this.state.timerQueue[this.state.timerQueue.indexOf(timer)];
    this.setState({
      timerQueue: this.state.timerQueue.splice(1, index)
    })
  }

  addTimer() {
    const token = JSON.parse(localStorage.the_main_app).token;

    fetch(`/timer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.timerName,
        length: this.state.timerLength,
        token: token
      })
    })
      .then(res => res.json())
      .then(json => {
        if(json.success) {
          this.props.getTimers(token)
          this.setState({
            isLoading: false,
            timerName: 'New Timer',
            timerLength: 60
          })
        } else {
          console.log('nope');
          this.setState({
            timerError: json.message,
            isLoading: false
          })
        }
      });
  }

  deleteTimer(timer) {
    console.log(timer);
    var pos = this.state.timerQueue.map(function(e) { return e._id; }).indexOf(timer._id);
    console.log(pos);
    if(pos == -1) {
      const token = JSON.parse(localStorage.the_main_app).token;
        const obj = getFromStorage('the_main_app');
        fetch(`/timer?timerId=${timer._id}&token=${obj.token}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(json => {
          console.log(json);
          if(json.success) {
            this.props.getTimers(token)
          } else {
            this.setState({
              timerError: json.message,
              isLoading: false
            })
          }
        });
    }
  }

  render() {
    return (
      <div>
        {this.props.timers.map(i => {
          return (
            <p key={i._id}>{i.name}, {i.length} Secs
              <button onClick={() => {this.editTimer(i)}}>Edit</button>
              <button onClick={() => {this.queueTimer(i)}}>Add</button>
              <button onClick={() => {this.deleteTimer(i)}}>Delete</button>
            </p>
          )
        })}
        <p>Queued Timers</p>
        <TimerQueue removeTimer={this.removeTimer} timers={this.state.timerQueue}></TimerQueue>

      </div>
    );
  }
}

export default TimerList;
