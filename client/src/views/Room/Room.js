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
import Webcam from "react-webcam";
import flagfr from '../../assets/fr.png';
import flagen from '../../assets/en.png';
import flagde from '../../assets/de.png';
import flages from '../../assets/es.png';
import * as axios from 'axios';
import 'google-translate';

const accessToken = "ya29.GltmBj13NJ1FdI18DdVupkby11f6T2ZHX7bWwsDeOmoOTsK7Gnuwhf2J3JtqMYqLpcp55L1NHKkwwJ88I7qMoLFoKM1LkC6eQXkrX3rQqwM-mYshzHUiQTEzXejm";

const googleTranslate = require('google-translate')(process.env.REACT_APP_API_KEY);

class App extends Component {

  state = {
    base64File :"",
    socket: socketIOClient("http://127.0.0.1:5000/"),
    id: '',
    name: '',
    lang: 'en',
    users: '',
    testFile: '',
    userPhotos: {},
    messages: [
      {
        name: 'Bob',
        message: 'this is a dump test'
      },
      {
        name: 'Chris',
        message: 'this is a dump test2'
      },
      {
        name: 'Kevin',
        message: 'this is a dump test3'
      },
      {
        name: 'Bob',
        message: 'this is a dump test5'
      }
    ]
  }

  setRef = webcam => {
    this.webcam = webcam;
  };
  
  capture = () => {
    const { id, name } = this.state;
    const imageSrc = this.webcam.getScreenshot();
    this.state.socket.emit("sendFrames", { img: imageSrc, room: id, user: name });

  };

  setLanguage(language) {
    this.setState({lang: language});
  }

  buttonClick(){
    console.log('hi');
  }
  scrollDown(){
    var elem = document.getElementById('messages-container');
    elem.scrollTop = elem.scrollHeight;
  }

  textToTranslatedVoice(data){
    if (data.user !== this.state.name || true) {
      googleTranslate.translate(data.msg, this.state.lang, (err, translation) => {
        // console.log(translation.translatedText);
        var receivedLanguage = 'English';

        switch (data.language) {
          case 'en':
            receivedLanguage = 'English';
              break;
          case 'de':
            receivedLanguage = 'Deutsch';
              break;
          case 'es':
            receivedLanguage = 'Español';
              break;
          case 'fr':
            receivedLanguage = 'Français';
              break;
          default: 
            receivedLanguage = 'English';
      }

        let newMessages = this.state.messages.concat({name:data.user, message: translation.translatedText, language: receivedLanguage})

        // let tmp = this.state.messages.map(x => x);
        
        // tmp.unshift({name:data.user, message: translation.translatedText})
        this.setState({
          messages: newMessages
        })
        this.scrollDown();
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
        if (data.user !== this.state.name) {
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
        }
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
    if (name==null) {
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

    socket.on("status", (data) => {
      this.setState({users: data.users})
      const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000
      });
      
      toast({
        type: 'success',
        title: `${data.msg}`
      });
    });

    socket.on("receiveTranscript", (data) => {
        this.textToTranslatedVoice(data)
      }
    );

    socket.on("receiveFrames", (data) => {
      if (data.user !== this.state.name) {
        const userPhotos = this.state.userPhotos;
        userPhotos[data.user] = data.img;
        this.setState({userPhotos: userPhotos});
        // this.setState({...this.state.usersPhotos, data['user']: data['img']});
  
        // data.user = chris, data.img = base64444
  
        // this.state.users.map(x => {})
      }
    });

    this.keepPoll();
  }

  keepPoll = () => {
    const { id, name } = this.state;
    const imageSrc = this.webcam.getScreenshot();
    this.state.socket.emit("sendFrames", { img: imageSrc, room: id, user: name });
    setTimeout(this.keepPoll, 250);
  }

  clickCopy() {
    this.setState({copied: true})
    const toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000
    });
    
    toast({
      type: 'success',
      title: 'Copy URL link!'
    });
  
  }

  render() {
    const { name, redirect, roomID, lang, userPhotos } = this.state;
    if (redirect) {
      return <Redirect to={`/`} />;
    }

    return (  
        <div className="room__container">

          {/* {
            this.state.messages.map(x => <div><span>{x.name}: {x.message}</span></div>)
          } */}
          <Grid celled style={{minHeight: 'calc(100vh - 5vh)', marginTop: '0' }}>
            <Grid.Row>
              <Grid.Column width={12}>
                <div className="room__header">
                  <BabelHeader></BabelHeader>
                  <div className="share-link">
                    <span className="ui header sharing-link">Share link: <span className="link">http://localhost:3000/room?id={this.state.id}</span> </span>
                    <CopyToClipboard text={`http://localhost:3000/room?id=${this.state.id}`}
                      onCopy={() => this.clickCopy()}>
                        <Icon size='big' name='copy' className="button-icon"/>
                    </CopyToClipboard>
                  </div>
                  <div>
                  <Button color='yellow' onClick={() => this.leaveRoom()}>Leave room</Button>
                  </div>
                </div>
                <Grid centered columns={4}>
                  <div className="grid-column-center-aligned">
                    <Webcam 
                      audio={false}
                      height={150}
                      ref={this.setRef}
                      screenshotFormat="image/jpeg"
                      width={150}  
                    />
                    {/* <button onClick={this.capture}>Capture photo</button> */}
                    {
                      Object.keys(userPhotos).map((key, index) => ( 
                        <Image key={index} src={userPhotos[key]} height='150'></Image>
                      ))
                    }

                    <Button.Group className="language-buttons">
                      <Button active={lang === 'fr'} onClick={() => this.setLanguage('fr')}><Image src={flagfr} size='mini'/></Button>
                      <Button active={lang === 'en'} onClick={() => this.setLanguage('en')}><Image src={flagen} size='mini'/></Button>
                      <Button active={lang === 'es'} onClick={() => this.setLanguage('es')}><Image src={flages} size='mini'/></Button>
                      <Button active={lang === 'de'} onClick={() => this.setLanguage('de')}><Image src={flagde} size='mini'/></Button>
                    </Button.Group>
                    <div style={{marginTop: '25px'}}>
                      <Recorder id={this.state.id} name={this.state.name} lang={lang}/>
                    </div>
                  </div>
                </Grid>
              </Grid.Column>
              <Grid.Column width={4} style={{maxHeight: '90vh', overflowY: 'scroll'}} id="messages-container">
                <Container >
                  {
                    this.state.messages.map((el, index) => {
                      return el.name.toLowerCase() === this.state.name.toLowerCase() ? 
                        <div className="msg__you__wrapper">
                          <Message compact key={el.message} className="msg__you__body">
                            {el.message}
                          </Message>
                        </div>
                        :
                        <div className="msg__others__wrapper">
                          <Message compact key={el.message} className="msg__others__body">
                            {el.name + ' ('+ el.language + ')'}:  {el.message}
                          </Message>
                        </div>
                    })
                  }
                </Container>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        <div className="users">
          <h3>Users: {this.state.users}</h3>
        </div>

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