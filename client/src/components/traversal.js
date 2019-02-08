import React, { Component } from 'react';
import axios from 'axios';
import { globalURL, config } from '../env'
// import CytoscapeComponent from 'react-cytoscapejs';


export default class Traversal extends Component {
  constructor() {
    super();
    this.state = {
        graph: {},
        currRoomInfo: {},
        playerInfo: {},
        currRoom: 0,
    };
    this.init = this.init.bind(this);
    this.move = this.move.bind(this);
    this.inverseDir = this.inverseDir.bind(this);
    this.automatedTraversal = this.automatedTraversal.bind(this);
    this.localStorageGraph = this.localStorageGraph.bind(this);
    // this.generateVisual = this.generateVisual.bing(this);
  };

  componentDidMount() {
    if (localStorage.hasOwnProperty('map')) {
      let storedData = JSON.parse(localStorage.getItem('map'));
      this.setState({ graph: storedData });
    }

    this.init();
  };


  // API Calls------------------------------------------------------------------------------------------------
  // status() {
  //   axios
  //   .post(`${globalURL}/status`, config)
  //   .then(res => {
  //     this.setState({ currRoomInfo: res.data });
  //     console.log('STATUS URL / playerInfo:', this.state.currRoomInfo);
  //   })
  //   .catch(error => console.log(error));
  // };

  init() {
    axios
      .get(`${globalURL}/init`, config)
      .then(res => {
        const { room_id, coordinates, exits } = res.data;
        let graph = this.localStorageGraph(room_id, coordinates, exits)
        this.setState({ currRoomInfo: res.data, graph });

        console.log('INIT URL / currRoomInfo:', this.state.currRoomInfo);
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


  //Traversal Functionality----------------------------------------------------------------------
  inverseDir(dir){
    if (dir === 'n'){
      return 's'
    }
    if (dir === 's'){
      return 'n'
    }
    if (dir === 'e'){
      return 'w'
    }
    if (dir === 'w'){
      return 'e'
    }
  };
  
  automatedTraversal = () => {
    const { room_id, exits, cooldown } = this.state.currRoomInfo;
    let traversalPath = [];
    let backtrackPath = [];
    let visitedRooms = {};
   
    visitedRooms[room_id] = exits;
    
    while (Object.keys(visitedRooms).length < 499) {
      console.log('HERE', visitedRooms)
      if (!visitedRooms[room_id]) {
        visitedRooms[room_id] = exits;
        visitedRooms[room_id].delete(backtrackPath[backtrackPath.length-1])
      };

      while(visitedRooms[room_id].length === 0 && backtrackPath.length > 0){
        let backtrack =  backtrackPath.pop();
        traversalPath.push(backtrack);

        this.move(backtrack);
        this.init();
      };

      let moveDir = visitedRooms[room_id].shift()
      traversalPath.push(moveDir);
      console.log('traversed')
      backtrackPath.push(this.inverseDir(moveDir));
      console.log('backtrack')

      setTimeout(this.move(moveDir), (cooldown * 1000));
      this.init();     
    };
    console.log('TRAVERSED ROOMS:', traversalPath)
  };
  
  // bfsPathToUnexplored() {
  //   // Breadth-First Search Shortest Path To Unexplored Exits
  //   const { currRoomInfo, graph } = this.state;

  //   let queue = [];
  //   let visitedRoom = new Set();

  //   // js Array.from() === python list()
  //   queue.push(Array.from(currRoomInfo.room_id));
  //   while (queue.length > 0) {
  //     // js shift() === python pop(0)
  //     let path = queue.shift();
  //     let room = path[path.length-1];
  //     if (!(visitedRoom.has(room))) {  
  //     // if (!(room in visitedRoom)) {
  //       console.log('HERE', visitedRoom)
  //       visitedRoom.add(room);
  //       for (let exit in graph[room]) {
  //         if (graph[room][exit] === '?') {
  //           return path;
  //         } 
  //         else {
  //           let duplicatePath = Array.from(path);
  //           duplicatePath.push(graph[room][exit]);
  //           queue.push(duplicatePath);
  //         };
  //       };
  //     };
  //   };
  //   return []
  // };

  // traversedRooms(backtrackPath) {
  //   const { graph } = this.state;

  //   let currentRoom = backtrackPath[0];
  //   let exploredExits = [];

  //   for (let room in backtrackPath.slice(1, backtrackPath.length)) {
  //     for (let exit in graph[currentRoom]) {
  //       if (graph[currentRoom][exit] === room) {
  //         exploredExits.push(exit);
  //         currentRoom = room;
  //         break
  //       };
  //     };
  //   };
  //   return exploredExits;
  // };

  // //examine more
  // automatedTraversal() {
  //   let graph = this.localStorageGraph()
  //   let traversalPath = []
  // }

//Local Storage-------------------------------------------------------------------------------------------------------
localStorageGraph(id, coords, exits) {
// const { graph } = this.state;
// const inverseDir = { n: 's', s: 'n', e: 'w', w: 'e' };
let graph = Object.assign({}, this.state.graph);
if (!this.state.graph[id]) {
  let mapping = [];
  mapping.push(coords);
  const roomExits = {};
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

//React Cytoscape-----------------------------------------------------------------------------------------------------
// generateVisual() {
//   const { coordinates } = this.state.currRoomInfo;
//   const rooms = [];
//   const edges = [];

//   for (let room in coordinates) {
//     const coordInfo = {
//       data: { id: room, label: `room ${room}`}, position:
//       { x: (coordinates)}
//     }
//   }
// }

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
        <button onClick={(event) => this.automatedTraversal(event)}>Automated Traversal</button>
      </div>
    );
  };
};

//Styled-Components----------------------------------------------------------------------------------------------------


