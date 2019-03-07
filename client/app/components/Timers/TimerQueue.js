import React, {Component} from 'react';
import SaveGroup from './SaveGroup.js';
import Groups from './Groups.js';


class TimerQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timerName: 'New Timer',
      groupName: 'New Group',
      timerLength: 60,
      isLoading: '',
      timerError: '',
      groups: []
    }
    this.saveGroup = this.saveGroup.bind(this)
    this.getGroups = this.getGroups.bind(this)
  }

  getGroups(token) {
    fetch(`/group?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(json => {
      if(json.success) {
        this.setState({
          groups: json.groups
        })
        return json.groups
      } else {
        this.setState({
          timerError: json.message,
          isLoading: false
        })
      }
    });
  }

  saveGroup(name) {
    const token = JSON.parse(localStorage.the_main_app).token;

    fetch(`/group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        timers: this.props.timerQueue,
        token: token
      })
    })
      .then(res => res.json())
      .then(json => {
        if(json.success) {
          this.props.clearQueue();
          this.getGroups(token);
          this.setState({
            isLoading: false,
            groupName: 'New Group'
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
    return (
      <div>
        {this.props.timerQueue.map(i => {
          return (
            <div key={i._id}>
              <p>{i.name}, {i.length} Secs
                <button onClick={() => {this.props.removeTimer(i)}}>Remove</button>
              </p>
            </div>
          )
        })}
        <SaveGroup groupName={this.state.groupName} saveGroup={this.saveGroup}></SaveGroup>
        <Groups getGroups={this.getGroups} deleteGroup={this.deleteGroup} groups={this.state.groups}></Groups>
      </div>
    );
  }
}

export default TimerQueue;
