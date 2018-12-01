import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Button, Header, Flag } from 'semantic-ui-react';
import SpeechRecognition from 'react-speech-recognition';

const propTypes = {
    // Props injected by SpeechRecognition
    transcript: PropTypes.string,
    resetTranscript: PropTypes.func,
    browserSupportsSpeechRecognition: PropTypes.bool
}

class Recorder extends Component {
    constructor(props) {
        super(props);
        this.state = {
          record: true,
          lang: 'en'
        }
    }

    startRecord = () => {
        this.props.startListening();
        this.setState({record: true});
    }

    stopRecord = () => {
        this.props.abortListening();
        this.setState({record: false});
        this.props.resetTranscript();
    }

    setLanguage(language) {
        this.setState({lang: language});
        this.props.resetTranscript();
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
            console.log(finalTranscript);
            resetTranscript();
        }

        return (
            <div>
                <Button 
                    color={record ? "green" : "white"} 
                    circular icon='microphone'
                    onClick={record ? this.stopRecord : this.startRecord}
                />
                <Button.Group>
                    <Button active={lang == 'fr'} onClick={() => this.setLanguage('fr')}><Flag name='france'/></Button>
                    <Button active={lang == 'en'} onClick={() => this.setLanguage('en')}><Flag name='us' /></Button>
                    <Button active={lang == 'es'} onClick={() => this.setLanguage('es')}><Flag name='spain' /></Button>
                    <Button active={lang == 'de'} onClick={() => this.setLanguage('de')}><Flag name='germany' /></Button>
                </Button.Group>
                <Header>{transcript}</Header>
            </div>
        );
    }
}

Recorder.propTypes = propTypes

export default SpeechRecognition(Recorder);