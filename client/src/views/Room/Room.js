import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import socketIOClient from "socket.io-client";
import Swal from 'sweetalert2';
import axios from 'axios';
import {Button} from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Redirect } from 'react-router';
import Recorder from '../../components/Recorder/Recorder';


class App extends Component {

  state = {
    socket: socketIOClient("http://127.0.0.1:5000/"),
    id: '',
    name: ''
  }

  joinRoom(id, name) {
    axios.post("http://localhost:5000/api/room/join", {
      room: id,
      user: name
    }).then(response => {
      if (response.data.error.length > 0) {
        alert(response.data.error);
      } else {
        this.state.socket.emit("join", { room: id, user: name });
      }
    })
    .catch(error => {
      console.log(error);
    });
  }
  changeName(name){
    this.setState({name: name});
  }

  leaveRoom() {
    const { socket, id, name } = this.state;
    socket.emit("leave", { room: id, user: name });
    this.setState({ redirect: true });
  }
  componentDidMount() {
    const { socket } = this.state;
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    let name = urlParams.get("name");

    // client doesn't have a name yet
    if (name==null){
      Swal({
        type: 'question',
        text: 'Please enter your name',
        input: 'text',
        confirmButtonText:'Submit'
      }).then((result) => {
        if (result.value){
          this.setState({ id: id});
          this.setState({ name: result.value });
          this.joinRoom(id, result.value)
        }
      })
    } else {
      this.setState({ id: id });
      this.setState({ name: name });
      this.joinRoom(id, name)
    }

    // listen to socket connection
    socket.on("connect", function() {
      console.log("Websocket connected!");
    });

    socket.on("status", function(data) {
      console.log(data);
    });
  }

  render() {
    const { name, redirect, roomID } = this.state;
    if (redirect) {
      return <Redirect to={`/`} />;
    }
    return (  
        <div>
          <p>share this url with all your friends!</p>
          <p> http://localhost:3000/room?id={this.state.id}</p>
            <CopyToClipboard text={`http://localhost:3000/room?id=${this.state.id}`}
              onCopy={() => this.setState({copied: true})}>
              <Button>Copy to clipboard</Button>
            </CopyToClipboard>
            <Header as='h1'> {this.state.name} Room</Header>
            <button onClick={() => this.leaveRoom()}>leave room</button>
            <Header as='h1'>Room</Header>
            <Recorder/>
        </div>
    );
  }
}

export default App;