import React, { Component } from 'react';
import axios from 'axios';
import { globalURL, config } from '../env'
import styled from 'styled-components';


export default class Content extends Component {
  constructor() {
    super();
    this.state = {
        graph: {},
        currRoomInfo: {},
        playerInfo: {},
    };
  };

  componentDidMount() {
    if (localStorage.hasOwnProperty('map')) {
      let storedData = JSON.parse(localStorage.getItem('map'));
      this.setState({ graph: storedData });
    }

    this.init();
  };


  // API Calls------------------------------------------------------------------------------------------------
  init() {
    axios
      .get(`${globalURL}/init`, config)
      .then(res => {
        this.setState({ currRoomInfo: res.data });
        console.log('INIT URL:', this.state.currRoomInfo);
      })
      .catch(error => console.log(error));
  };

  move(dir) {
    console.log('Should be waiting.....')
    let movement = { 'direction': dir }

    axios
      .post(`${globalURL}/move`, movement , config)
      .then(res => {
        const { room_id, coordinates, exits } = res.data;
        let graph = this.localStorageGraph(room_id, coordinates, exits)

        this.setState({ currRoomInfo: res.data, graph });
        console.log('MOVE URL:', this.state.currRoomInfo);
      })
      .catch(error => console.log(error));
    }; 

  moveAuto(time, dir) {
    console.log('Should be waiting.....')
    let movement = { 'direction': dir }

    axios
      .post(`${globalURL}/move`, movement , config)
      .then(res => {
        const { room_id, coordinates, exits } = res.data;
        let graph = this.localStorageGraph(room_id, coordinates, exits)

        this.setState({ currRoomInfo: res.data, graph });
        console.log('MOVE URL:', this.state.currRoomInfo);
        time();
      })
      .catch(error => console.log(error));
    }; 




  //Traversal Functionality---------------------------------------------------------------------------------------------------------------------------------------------
  inverseDir = (dir) => {
    if (dir === 'n'){
      return 's'
    }
    else if (dir === 's'){
      return 'n'
    }
    else if (dir === 'e'){
      return 'w'
    }
    else if (dir === 'w'){
      return 'e'
    }
  };
  
  async autoTraversal() {
    let wait = (time) => new Promise(resolve => setTimeout(resolve, time));
    console.log('waiting......', )
    let move = (dir) => new Promise(resolve => this.moveAuto(resolve, dir));

    let traversalPath = [];
    let backtrackPath = [];
    let visitedRooms = {};
   
    visitedRooms[this.state.currRoomInfo.room_id] = this.state.currRoomInfo.exits;


    while (Object.keys(visitedRooms).length < 500) {
      console.log('vistedROOMS LENGTH', Object.keys(visitedRooms).length)
      console.log('TRACKING', visitedRooms);
      if (!(this.state.currRoomInfo.room_id in visitedRooms)) {
        visitedRooms[this.state.currRoomInfo.room_id] = this.state.currRoomInfo.exits;

        let last_backtrack_val = backtrackPath[backtrackPath.length-1]
        let last_backtrack_val_index = visitedRooms[this.state.currRoomInfo.room_id].indexOf(last_backtrack_val)
        console.log('VISITED ROOM', visitedRooms)
        console.log('ROOM', this.state.currRoomInfo.room_id, 'REMOVE', last_backtrack_val)
        delete visitedRooms[this.state.currRoomInfo.room_id].splice(last_backtrack_val_index, 1);
      }
      else if (visitedRooms[this.state.currRoomInfo.room_id].length === 0 && backtrackPath.length > 0 ) {
          let backtrackDir = backtrackPath.pop();
        traversalPath.push(backtrackDir);

        console.log("about to move... (backtrack): " , backtrackDir, 'from room', this.state.currRoomInfo.room_id);
        await wait(this.state.currRoomInfo.cooldown * 2000);
        console.log('waiting in else if......', this.state.currRoomInfo.cooldown * 2000)
        await move(backtrackDir);
      }
      else {
          let moveDir = visitedRooms[this.state.currRoomInfo.room_id].shift()
        console.log('ROOM', this.state.currRoomInfo.room_id, 'MOVE&REMOVE', moveDir)
        traversalPath.push(moveDir);
        backtrackPath.push(this.inverseDir(moveDir));

        console.log("about to move... (move): " , moveDir,'from room', this.state.currRoomInfo.room_id);
        await wait(this.state.currRoomInfo.cooldown * 2000);
        console.log('waiting in else......', this.state.currRoomInfo.cooldown * 2000)
        await move(moveDir);
      };
    };  
    console.log('!!!!!!WHILE LOOP ENDED!!!!!!')
    console.log(Object.keys(visitedRooms).length, "ROOMS VISITED")
    console.log('TRAVERSED PATH', traversalPath)  
    console.log('BACKTRACK PATH', backtrackPath) 
  };
  
//Local Storage-------------------------------------------------------------------------------------------------------
localStorageGraph = (id, coords, exits) => {
// const { graph } = this.state;
// const inverseDir = { n: 's', s: 'n', e: 'w', w: 'e' };
let graph = Object.assign({}, this.state.graph);
if (!this.state.graph[id]) {
  let mapping = [];
  let roomExits = {};
  mapping.push(coords);
  exits.forEach(exit => {roomExits[exit] = '?'});
  mapping.push(roomExits);

  graph = { ...graph, [id]: mapping};
};

// for (let key in this.state.graph){
//   if (key.includes('?')){
//   console.log('HEEEEERRRRREEEEEEEEEEEE')
//   // graph[prevRoom][1][nextRoom] = id;
//   // graph[id][1][this.state.inverseDir[nextRoom]] = prevRoom;
// };
// }

localStorage.setItem('map', JSON.stringify(graph));
return graph;

};

//Render--------------------------------------------------------------------------------------------------------------
  render() {
    const { room_id, title, description,players, items, exits, cooldown, errors, messages } = this.state.currRoomInfo

    return (
      <div>
        <p>{errors}</p>
        <p>{messages} You are now in <strong>room {room_id}</strong>, {title}.</p>
        <p>{description}</p>
        <p>This room contains item(s): <strong>{items}</strong></p>
        <p>This room has player(s): <strong>{players}</strong></p>
        <p>You must wait <strong>{cooldown} seconds</strong> before your next move.</p>
        <p>Your next moving options are <strong>{exits}</strong>.</p>

        <button onClick={() => this.move('w')}>West</button>
        <button onClick={() => this.move('n')}>North</button>
        <button onClick={() => this.move('s')}>South</button>
        <button onClick={() => this.move('e')}>East</button>
        <button onClick={(dir) => this.autoTraversal(dir)}>Auto Traversal</button>
      </div>
    );
  };
};

//Styled-Components----------------------------------------------------------------------------------------------------


