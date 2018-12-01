import './BabelHeader.css';
import React, { Component } from 'react';
import { Button, Header} from 'semantic-ui-react';
import SpeechRecognition from 'react-speech-recognition';
import socketIOClient from "socket.io-client";

class BabelHeader extends Component {
    render() {
        return (
            <Header as='h1' className="babel-header">Babel</Header>
        );
    }
}

export default BabelHeader;