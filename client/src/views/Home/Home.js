import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { Input } from 'semantic-ui-react';
import * as axios from 'axios';
import { Redirect } from 'react-router';


class App extends Component {
  state = {
    isJoin: true, 
    name: "",
    redirect: false,
    roomID: ""
  }

toggle(state){
  this.setState({isJoin: state});
}

onJoinRoom(){
  this.setState({redirect: true});
}
onCreateRoom(){
  axios.get(`http://localhost:5000/api/room/create`).then(res => {
    const id = res.data.room;
    this.setState({ roomID: id });
    this.setState({ redirect: true });
  });
}
changeName(event){
  this.setState({name: event.target.value})
}
changeRoomID(event){
  this.setState({roomID: event.target.value})
}

rendering(){
  if (this.state.isJoin){
    return(
    <div>
      <Input onChange={event => this.changeName(event)} placeholder="Name"></Input>
      <Input onChange={event => this.changeRoomID(event)} placeholder="Room Code"></Input>
      <Button onClick={() => this.onJoinRoom()}> Submit</Button>
    </div>
    );
  }
  return(
    <div>
      <Input onChange={event => this.changeName(event)} placeholder="Name"></Input>
      <Button onClick={() => this.onCreateRoom()}> Submit</Button>
    </div>);
}
  render() {
    const { name, redirect, roomID } = this.state;
    if (redirect) {
      return <Redirect to={`/room?id=${roomID}&name=${name}`} />;
    }
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