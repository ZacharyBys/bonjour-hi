import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Button, Header, Flag } from 'semantic-ui-react';
import SpeechRecognition from 'react-speech-recognition';
import socketIOClient from "socket.io-client";
import 'google-translate';

const propTypes = {
    // Props injected by SpeechRecognition
    transcript: PropTypes.string,
    resetTranscript: PropTypes.func,
    browserSupportsSpeechRecognition: PropTypes.bool
}

const googleTranslate = require('google-translate')(process.env.REACT_APP_API_KEY);

class Recorder extends Component {
    constructor(props) {
        super(props);
        this.state = {
        socket: socketIOClient("http://localhost:5000/"),
          record: true,
          lang: 'en',
        }
    }

    testTranslate = () => {
        const { lang } = this.state;
        googleTranslate.translate('Hello this is a test', lang, function(err, translation) {
            console.log(translation.translatedText);
            // =>  { translatedText: 'Hallo', originalText: 'Hello', detectedSourceLanguage: 'en' }
        });
    }

    startRecord = () => {
        this.props.startListening();
        console.log("start recording");
        this.setState({record: true});
    }

    stopRecord = () => {
        this.props.abortListening();
        console.log("stop recording");
        this.setState({record: false});
        this.props.resetTranscript();
    }

    setLanguage(language) {
        this.setState({lang: language});
        this.props.resetTranscript();
    }

    sendMessage(transcript) {
        const { socket, id, name } = this.props;
        this.state.socket.emit("originalTranscript", {
            room: id,
            user: name,
            transcript: transcript
        });
    }

    render() {
        const { transcript, resetTranscript, recognition, browserSupportsSpeechRecognition, finalTranscript } = this.props;
        const { lang, record } = this.state;

        if (!browserSupportsSpeechRecognition) {
            return null
        }

        // dis in ISO-639
        recognition.lang = lang + '-CN';

        if (finalTranscript) {

            this.sendMessage(finalTranscript);
            resetTranscript();
        }

        return (
            <div>
                <Button 
                    color={record ? "green" : "grey"} 
                    circular icon='microphone'
                    onClick={record ? this.stopRecord : this.startRecord}
                />
                <Button.Group>
                    <Button active={lang === 'fr'} onClick={() => this.setLanguage('fr')}><Flag name='france'/></Button>
                    <Button active={lang === 'en'} onClick={() => this.setLanguage('en')}><Flag name='us' /></Button>
                    <Button active={lang === 'es'} onClick={() => this.setLanguage('es')}><Flag name='spain' /></Button>
                    <Button active={lang === 'de'} onClick={() => this.setLanguage('de')}><Flag name='germany' /></Button>
                </Button.Group>
                <Header>{transcript}</Header>
            </div>
        );
    }
}

Recorder.propTypes = propTypes

export default SpeechRecognition(Recorder);