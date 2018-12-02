import React, { Component } from 'react';
import TwilioVideo from 'react-twilio';

class App extends Component {
  constructor(props) {
    super(props);
    this.shadowStyle = {
      border: '1px solid #dcd9d9',
      borderRadius: '4px',
      marginBottom: '15px',
      boxShadow: '5px 5px 5px #e0e3e4',
      fontWeight: 'lighter'
    }
    let obj = { token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2NiMTg2ODM3MDM2M2U0Y2YwZjg3NjE4Nzk4NGNmNTNmLTE1NDM3MjMxMjYiLCJpc3MiOiJTS2NiMTg2ODM3MDM2M2U0Y2YwZjg3NjE4Nzk4NGNmNTNmIiwic3ViIjoiQUMxNjlmNjI4NmExMGRmYWE3YWY0Yzg2ZGFkMWJjNmJmMCIsImV4cCI6MTU0MzcyNjcyNiwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiQUMxNjlmNjI4NmExMGRmYWE3YWY0Yzg2ZGFkMWJjNmJmMCIsInZpZGVvIjp7InJvb20iOiJjaHJpcyJ9fX0.2Nz-RwMakpM2BRdxfBhy9xGUEb68CGNh1bSm6bbxkJI"}
    this.token = obj.token;
  }
  render() {
    return (
      <div style={{ heigh: '800px', width: '50%' }}>
        <TwilioVideo roomName={'chris'} token={this.token} style={{ ...this.shadowStyle, boxShadow: '5px 5px 5px #e0e3e4' }} />
      </div>
    );
  }
}

export default App;