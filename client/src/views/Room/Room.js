import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import socketIOClient from "socket.io-client";
import Swal from 'sweetalert2';
import axios from 'axios';
import {Button} from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

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
  changeName(name){
    this.setState({name: name});
  }
  componentDidMount() {
    const { socket } = this.state;
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const name = urlParams.get("name");
console.log(name);
    if (name==null){
      Swal({
        type: 'question',
        text: 'Please enter your name',
        input: 'text',
        confirmButtonText:'Submit'
      }).then((result) => {
        if (result.value){
          this.changeName(result.value);
        }
      })
    }

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
          <p>share this url with all your friends!</p>
          <p> http://localhost:3000/room?id{this.state.id}</p>
           <CopyToClipboard text={`http://localhost:3000/room?id${this.state.id}`}
            onCopy={() => this.setState({copied: true})}>
            <Button>Copy to clipboard</Button>
          </CopyToClipboard>
            <Header as='h1'> {this.state.name} Room</Header>
        </div>
    );
  }
}

export default App;