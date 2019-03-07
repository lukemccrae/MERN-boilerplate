import React, {Component} from 'react';
import {
  getFromStorage,
  setInStorage
} from '../../utils/storage';

class Groups extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      groups: this.props.groups
    }
    this.deleteGroup = this.deleteGroup.bind(this)
  }

  deleteGroup(group) {
    const token = JSON.parse(localStorage.the_main_app).token;
      const obj = getFromStorage('the_main_app');
      fetch(`/group?groupId=${group._id}&token=${obj.token}`, {
        method: 'DELETE',
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
        {this.state.groups.map(group => {
          return (
            <div key={group._id}>
              <h4>{group.name}<button onClick={() => {this.deleteGroup(group)}}>Delete Group</button></h4>
                {group.timers.map( t => {
                  return (
                    <div key={t._id}>
                      <p>{t.name}, {t.length} Seconds </p>
                    </div>
                  )
                })}
            </div>
          )
        })}
      </div>
    );
  }
}

export default Groups;
