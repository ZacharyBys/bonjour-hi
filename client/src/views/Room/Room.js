import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import socketIOClient from "socket.io-client";
import axios from 'axios';

class App extends Component {

  state = {
    socket: socketIOClient("http://127.0.0.1:5000/"),
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

  componentDidMount() {
    const { socket } = this.state;
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const name = urlParams.get("name");

    this.setState({ id: id });
    this.setState({ name: name });
    this.joinRoom(id, name)

    socket.on("connect", function() {
      console.log("Websocket connected!");
    });

    socket.on("status", function(data) {
      console.log(data);
    });
  }



  render() {
    return (
        <div>
            <Header as='h1'>Room</Header>
        </div>
    );
  }
}

export default App;