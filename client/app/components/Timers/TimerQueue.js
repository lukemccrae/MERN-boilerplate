import React, {Component} from 'react';

class TimerQueue extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      timerName: 'New Timer',
      timerLength: 60,
      isLoading: '',
      timerError: ''
    }
    this.saveGroup = this.saveGroup.bind(this)

  }

  saveGroup() {
    console.log('hi');
  }

  render() {
    return (
      <div>
        {this.props.timers.map(i => {
          return (
            <div key={i._id}>
              <p>{i.name}, {i.length} Secs
                <button onClick={() => {this.props.removeTimer(i)}}>Remove</button>
              </p>
            </div>
          )
        })}
      </div>
    );
  }
}

export default TimerQueue;
