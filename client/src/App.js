import React, { Component } from 'react';
import styled from 'styled-components';
import Header from './components/header'
import Content from './components/content'
import Visualization from './components/visualization'
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Content />
        <Visualization />
      </div>
    );
  };
};

//Styled-Components----------------------------------------------------------------------------------------------------


