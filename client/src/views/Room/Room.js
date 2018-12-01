import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import ReactAudioPlayer from 'react-audio-player';
import socketIOClient from "socket.io-client";
import Swal from 'sweetalert2';
import {Button} from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Redirect } from 'react-router';
import Recorder from '../../components/Recorder/Recorder';
import * as axios from 'axios';

const accessToken = "ya29.GltlBqsoXOOKESdRfzYYxrrkldH09KEPdxF_Dx4XFZQG8Q_mYJ6sEXl1w2UxBU-UWgh8krWQfIrRRIMvVirOeVr217htXKcObBq64oHKZveeVSvX2ADOHXDpc_5u";



class App extends Component {

  state = {
    base64File :"",
    socket: socketIOClient("http://127.0.0.1:5000/"),

    id: '',
    name: ''
  }

  buttonClick(){
    console.log('hi');
  }
  otherFunction(){
    let context = new AudioContext();
    var base64Buffer = "";
    let config = {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }
    axios.post('https://texttospeech.googleapis.com/v1beta1/text:synthesize', { 
      'input':{
        'text':'I\'ve added the event to your calendar.'
      },
      'voice':{
        'languageCode':'en-gb',
        'name':'en-GB-Standard-A',
        'ssmlGender':'FEMALE'
      },
      'audioConfig':{
        'audioEncoding':'MP3'
      }
    }, config)
    .then((response) => {
      this.setState({base64File: response.data.audioContent});
    })
    .catch(function (error) {
        console.log(error);
    });
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

    socket.on("receiveTranscript", function(data) {
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
            <Button onClick={() => this.otherFunction()}>Click here to fetch</Button>
            <ReactAudioPlayer
              src={'data:audio/mp3;base64,'+this.state.base64File}
              autoPlay
              controls
            />
            {/*this.state.base64File*/}
            <Button onClick={() => this.leaveRoom()}>leave room</Button>
            <Recorder id={this.state.id} name={this.state.name}/>
        </div>
    );
  }
}

export default App;