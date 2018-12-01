import React, { Component } from 'react';
import './App.css';
import { Route, Switch, withRouter } from "react-router-dom";
import Home from './views/Home/Home';
import Room from './views/Room/Room';

class App extends Component {
  render() {
    return (
      <main>
      <Switch>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/room" component={Room} />
      </Switch>
      </main>
    );
  }
}

export default withRouter(App);
