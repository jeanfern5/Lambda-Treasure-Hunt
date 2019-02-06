import React, { Component } from 'react';
import Header from './components/header'
import Traversal from './components/traversal'
// import Manual from './components/manual'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Traversal />
        {/* <Manual /> */}
      </div>
    );
  };
};

export default App;
