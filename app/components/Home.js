// @flow
import React, { Component } from 'react';
import StundenList from './StundenList';
import Notification from './Notification';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div>
          <h2>Lornsenschule Vertretungsplan</h2>
          <br />
          <StundenList />
          { Notification("test", "test") }
        </div>
      </div>
    );
  }
}
