import React, {Component} from 'react';
import TimerList from './TimerList.js';

class TimerControl extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <TimerList></TimerList>
      <TimerQueue></TimerQueue>
    );
  }
}

export default TimerControl;
