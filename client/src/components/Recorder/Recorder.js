import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Button, Header } from 'semantic-ui-react';
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
          record: true
        }
    }

    startRecord = () => {
        this.props.startListening();
        this.setState({record: true});
    }

    stopRecord = () => {
        this.props.abortListening();
        this.setState({record: false});
    }


    render() {
        const { transcript, resetTranscript, recognition, browserSupportsSpeechRecognition, finalTranscript } = this.props;

        if (!browserSupportsSpeechRecognition) {
            return null
        }

        // dis in ISO-639
        recognition.lang = 'en-CN';

        if (finalTranscript) {
            console.log(finalTranscript);
            resetTranscript();
        }

        return (
            <div>
                <Button 
                    color={this.state.record ? "red" : "white"} 
                    circular icon={this.state.record ? 'microphone slash' : 'microphone'}
                    onClick={this.state.record ? this.stopRecord : this.startRecord}
                />
                <Header>{transcript}</Header>
            </div>
        );
    }
}

Recorder.propTypes = propTypes

export default SpeechRecognition(Recorder);