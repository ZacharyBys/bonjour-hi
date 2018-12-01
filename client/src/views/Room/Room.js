import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import Recorder from '../../components/Recorder/Recorder';

class App extends Component {
  render() {
    return (
        <div>
            <Header as='h1'>Room</Header>
            <Recorder/>
        </div>
    );
  }
}

export default App;