import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import ReactAudioPlayer from 'react-audio-player';


import * as axios from 'axios';

const accessToken = 'ya29.GltlBhCAmHwtzNTbQfKboVPtq2PW_C3m1rrU7NvI50JSifIc-NuKksiBdnvbHtTXyQUeWeZTuzPEq7VV7iivHMkBy6_-aU01wwtwxBJwjCFHTXyQYSeGw4h6rBXm';

class App extends Component {

  state = {
    base64File :""
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
  render() {
    return (
        <div>
            <Header as='h1'>Room</Header>
            <button onClick={() => this.otherFunction()}>Click here to fetch</button>
            <ReactAudioPlayer
              src={'data:audio/mp3;base64,'+this.state.base64File}
              autoPlay
              controls
            />
            {this.state.base64File}
        </div>
    );
  }
}

export default App;