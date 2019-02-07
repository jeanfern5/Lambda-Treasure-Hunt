import React, { Component } from 'react';
import axios from 'axios';
import { globalURL, config } from '../env'

class Traversal extends Component {
  constructor() {
    super();
    this.state = {
        graph: {},
        initRoomInfo: {},
        currRoomInfo: {},
        timeoutId: 0
    };
  };

  componentDidMount() {
    this.init();
  };

  init() {
    axios
      .get(`${globalURL}/init`, config)
      .then(res => {
        this.setState({ initRoomInfo: res.data });
        console.log('INIT URL / initRoomInfo:', this.state.initRoomInfo);
      })
      .catch(error => console.log(error));
  };

  move(dir) {
    let movement = { 'direction': dir }
    axios
      .post(`${globalURL}/move`, movement , config)
      .then(res => {
        this.setState({ currRoomInfo: res.data });
        console.log('MOVE URL / currRoomInfo:', this.state.currRoomInfo);
      })
      .catch(error => console.log(error));
  };


  render() {
    return (
      <div>
        <button onClick={() => this.move('w')}>West</button>
        <button onClick={() => this.move('n')}>North</button>
        <button onClick={() => this.move('s')}>South</button>
        <button onClick={() => this.move('e')}>East</button>
      </div>
    );
  }
}

export default Traversal;