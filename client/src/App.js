import React, { Component } from 'react';
import Init from './components/init'
import './App.css';
require('dotenv').config()
// require('dotenv/config')
// require('./components/init')

class App extends Component {
  render() {
    return (
      <div className="App">
        <Init />
      </div>
    );
  };
};

export default App;
