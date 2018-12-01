import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { Input } from 'semantic-ui-react';
class App extends Component {
  state = {
    isJoin: true
  }

toggle(state){
  this.setState({isJoin: state});
}

rendering(){
  if (this.state.isJoin){
    return(
    <div>
      <Input placeholder="Name"></Input>
      <Input placeholder="Room Code"></Input>
    </div>
    );
  }
  return(
    <div>
      <Input placeholder="Name"></Input>
    </div>);
}
  render() {
    return (
        <div>
            <Header as='h1'>Connectabel Home</Header>
            {this.rendering()}
            <Button onClick={() => this.toggle(false)}> Create Room </Button>
            <Button onClick={() => this.toggle(true)}> Join Room </Button> 
        </div>
    );
  }
}

export default App;