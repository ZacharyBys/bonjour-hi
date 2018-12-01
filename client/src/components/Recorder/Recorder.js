import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class Recorder extends Component {
    constructor(props) {
        super(props);
        this.state = {
          record: false
        }
    }

    startRecord = () => {
        this.setState({record: true});
    }

    stopRecord = () => {
        this.setState({record: false});
    }

    render() {
        return (
            <div>
                <Button 
                    color={this.state.record ? "red" : "white"} 
                    circular icon='microphone'
                    onClick={this.startRecord}
                />
                <Button 
                    color={!this.state.record ? "red" : "white"} 
                    circular icon='stop'
                    onClick={this.stopRecord}
                />
            </div>
        );
    }
}

export default Recorder;