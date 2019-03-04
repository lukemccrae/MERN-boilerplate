import React, {Component} from 'react';
import TimerList from './TimerList.js';

class SaveGroup extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
    }
    this.saveGroup = this.saveGroup.bind(this)
  }

  saveGroup() {
    console.log('save shit');
  }

  render() {
    return (
      <button onClick={() => {this.saveGroup()}}>Save Group</button>
    );
  }
}

export default SaveGroup;
