import './BabelHeader.css';
import React, { Component } from 'react';
import { Header} from 'semantic-ui-react';

class BabelHeader extends Component {
    render() {
        return (
            <Header as='h2' className="babel-header">Bonjour-Hi</Header>
        );
    }
}

export default BabelHeader;