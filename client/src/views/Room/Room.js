import './Room.css';
import React, { Component } from 'react';
import { Header, Container, Button, Flag, Message, GridRow, Icon, IconGroup, Image, Grid  } from 'semantic-ui-react';
import ReactAudioPlayer from 'react-audio-player';
import socketIOClient from "socket.io-client";
import Swal from 'sweetalert2';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Redirect } from 'react-router';
import Recorder from '../../components/Recorder/Recorder';
import BabelHeader from '../../components/BabelHeader/BabelHeader';
import flagfr from '../../assets/fr.png';
import flagen from '../../assets/en.png';
import flagde from '../../assets/de.png';
import flages from '../../assets/es.png';
import * as axios from 'axios';
import 'google-translate';

const accessToken = "ya29.GltlBlWfzsHiHu3BS-PL2oiD1Ccmlw0gR-QujaMkaQrWaRXySfo72N_BoQ7K9buaWnks7LVl2gtXhI5QbUGj3uoTR5MXPen-hx3A5Cdxj2lBLkH7odjisnOcQJd3";

const googleTranslate = require('google-translate')(process.env.REACT_APP_API_KEY);

class App extends Component {

  state = {
    base64File :"",
    socket: socketIOClient("http://127.0.0.1:5000/"),
    id: '',
    name: '',
    lang: 'en',
    messages: []
  }

  setLanguage(language) {
    this.setState({lang: language});
  }

  buttonClick(){
    console.log('hi');
  }
  textToTranslatedVoice(data){
    if (data.user !== this.state.name || true) {
      googleTranslate.translate(data.msg, this.state.lang, (err, translation) => {
        console.log(translation.translatedText);
        let newMessages = [{name:data.user, message: translation.translatedText}].concat(this.state.messages); 
        this.setState({
          messages: newMessages
        })
        console.log(this.state.messages);
        const text = translation.translatedText;
        let context = new AudioContext();
        let spokenLanguage = 'en-GB';
        //en-US, de-DE, es-ES, fr-FR
        switch (this.state.lang) {
            case 'en':
                spokenLanguage = 'en-GB';
                break;
            case 'de':
                spokenLanguage = 'de-DE';
                break;
            case 'es':
                spokenLanguage = 'es-ES';
                break;
            case 'fr':
                spokenLanguage = 'fr-FR';
                break;
            default: 
            spokenLanguage = 'en-GB';
        }
        var base64Buffer = "";
        let config = {
          headers: {
            'Authorization': 'Bearer ' + accessToken
          }
        }
        axios.post('https://texttospeech.googleapis.com/v1beta1/text:synthesize', { 
          'input':{
            'text': text
          },
          'voice':{
            'languageCode':spokenLanguage,
            'name':spokenLanguage + '-Standard-A',
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
      });
    }
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

    socket.on("receiveTranscript", (data) => {
        this.textToTranslatedVoice(data)
      }
    );
  }

  render() {
    const { name, redirect, roomID, lang } = this.state;
    if (redirect) {
      return <Redirect to={`/`} />;
    }
    return (  
        <div className="app-container">
          <BabelHeader></BabelHeader>
          <Header as='h2' className="sharing-incitation">Want your friends to join?</Header>
          <span className="ui header sharing-link">Share this url: <span className="link">http://localhost:3000/room?id={this.state.id}</span> </span>
          <CopyToClipboard text={`http://localhost:3000/room?id=${this.state.id}`}
            onCopy={() => this.setState({copied: true})}>
              <Icon size='large' name='copy' className="button-icon"/>
          </CopyToClipboard>
          {/* <Grid columns={2}>
          <Grid.Column>

          </Grid.Column>
          </Grid> */}
          <br></br>
          <br></br>
          <br></br>


          <span className="ui header your-name"> Your name: {this.state.name}</span>
          <Button onClick={() => this.leaveRoom()}>Leave room</Button>


          
          {/*this.state.base64File*/}
          

        <Grid centered columns={4}>
        <div className="grid-column-center-aligned">
          <Image src="/skype-example.png" height='300'></Image>
          <Button.Group className="language-buttons">
            <Button active={lang === 'fr'} onClick={() => this.setLanguage('fr')}><Image src={flagfr} size='mini'/></Button>
            <Button active={lang === 'en'} onClick={() => this.setLanguage('en')}><Image src={flagen} size='mini'/></Button>
            <Button active={lang === 'es'} onClick={() => this.setLanguage('es')}><Image src={flages} size='mini'/></Button>
            <Button active={lang === 'de'} onClick={() => this.setLanguage('de')}><Image src={flagde} size='mini'/></Button>
          </Button.Group>
          <Recorder id={this.state.id} name={this.state.name} lang={lang}/>
          <Container>
              {
                this.state.messages.map(el => <Message visible key={this.state.messages.indexOf(el)}> {el.name} : {el.message} </Message>)
              }
          </Container>
        </div>
        </Grid>
        <ReactAudioPlayer
            src={'data:audio/mp3;base64,'+this.state.base64File}
            autoPlay
            controls
          />
      </div>
    );
  }
}

export default App;