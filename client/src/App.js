import React, { Component } from 'react';
import Header from './components/header'
import LocationInfo from './components/locationInfo'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <LocationInfo />
      </div>
    );
  };
};

export default App;
