import React, {Component} from 'react';

class SaveGroup extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      name: props.groupName
    }
    this.onNameInputChange = this.onNameInputChange.bind(this);
  }

  onNameInputChange(event) {
    this.setState({
      name: event.target.value
    })
  }

  render() {
    return (
      <div>
        <input value={this.state.name} onChange={this.onNameInputChange} placeholder="Name..."></input>
        <button onClick={() => {this.props.saveGroup(this.state.name)}}>Save Group</button>
      </div>
    );
  }
}

export default SaveGroup;
