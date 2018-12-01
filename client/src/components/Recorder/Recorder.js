import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Button, Header} from 'semantic-ui-react';
import SpeechRecognition from 'react-speech-recognition';
import socketIOClient from "socket.io-client";
import 'google-translate';

const propTypes = {
    // Props injected by SpeechRecognition
    transcript: PropTypes.string,
    resetTranscript: PropTypes.func,
    startListening: PropTypes.func,
    stopListening: PropTypes.func,
    browserSupportsSpeechRecognition: PropTypes.bool
}

const googleTranslate = require('google-translate')(process.env.REACT_APP_API_KEY);

class Recorder extends Component {
    constructor(props) {
        super(props);
        this.state = {
        socket: socketIOClient("http://localhost:5000/"),
          record: true,
          lang: this.props.lang,
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
        console.log("stop recording");
        this.setState({record: false});
        this.props.resetTranscript();
        this.props.stopListening();
    }

    sendMessage(transcript) {
        const { socket, id, name } = this.props;
        this.state.socket.emit("originalTranscript", {
            room: id,
            user: name,
            transcript: transcript
        });
    }

    shouldComponentUpdate(nextProps) {
        if (this.state.lang != nextProps.lang) {
            this.setState({lang: nextProps.lang});
        }

        return true;
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
                <Header>{transcript}</Header>
            </div>
        );
    }
}

Recorder.propTypes = propTypes

export default SpeechRecognition(Recorder);