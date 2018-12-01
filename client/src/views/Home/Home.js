import React, { Component } from 'react';
import { Header, Button, Grid, Input } from 'semantic-ui-react';
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
        <div className="home">
          <Header style={{textAlign: 'center', fontSize: '5rem', padding: '55px 0px', color: '#5C6AC4'}} as='h1'>Babel</Header>
          <Grid verticalAlign='middle' columns={4} centered>
            <Grid.Row>
              <Grid.Column>
                <div>
                  <h3>Create a room</h3>
                  <Input onChange={event => this.changeName(event)} placeholder="Name"></Input>
                  <Button onClick={() => this.onCreateRoom()}> Create </Button>
                </div>
                <br />
                <div>
                  <h3>Join a room</h3>
                  <Input onChange={event => this.changeName(event)} placeholder="Name"></Input>
                  <Input onChange={event => this.changeRoomID(event)} placeholder="Room Code" style={{marginLeft: '15px'}}></Input>
                  <Button onClick={() => this.onJoinRoom()}> Join </Button>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
    );
  }
}

export default App;