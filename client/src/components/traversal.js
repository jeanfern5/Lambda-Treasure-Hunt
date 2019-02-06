import React, { Component } from 'react';
import axios from 'axios';
import { Input, Form, Label, Button } from 'reactstrap';
import { config, globalURL} from '../env'

class Traversal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'roomInfo': {},
            'traversalPath': [],
            'visitedRoom': {0: {'n': '?', 's': '?', 'e': '?', 'w': '?'}},
            'inverseDirection': {'n': 's', 's':'n', 'e':'w', 'w':'e'},
        };
    };

    componentDidMount() {
        axios   
        .get(`${globalURL}/init`, config)
        .then(res => {
            this.setState({ roomInfo: res.data });
            // console.log('HERE', this.state.roomInfo)
        })
        .catch(err => {
            console.log('ERROR with INIT URL', err)
        });

        if (localStorage.hasOwnProperty('map')) {
            this.setState({ map: JSON.parse(localStorage.getItem('map')) });
        };
    };

    // move = dir => {
    //     const moveInput = { direction: dir }

    //     axios
    //     .post(`${globalURL}/move`, moveInput, config)
    //     .then(res => {
    //         console.log('THERE', [...res.data.exits])
    //         this.setState({                    
    //             room_id: res.data.room_id,
    //             title: res.data.title,
    //             description: res.data.description,
    //             coordinates: res.data.coordinates,
    //             players: res.data.players,
    //             items: res.data.items,
    //             exits: res.data.exits,
    //             cooldown: res.data.cooldown,
    //             errors: res.data.errors,
    //             messages: res.data.messages,
    //             traversalPath: this.state.traversalPath.concat(this.state.dir)                      
    //          });
    //     })
    //     .catch(err => {
    //         console.log('ERROR with MOVE URL', err)
    //     });
    // };

    render() {
        const { moveInput } = this.state;
        const { room_id, title, description, coordinates, players, items, exits, cooldown, errors, messages } = this.state.roomInfo;
        // console.log('DOWN HERE', exits.slice(0))
        return(
            <div>
                <p>Room ID: {room_id}</p>
                <p>Title: {title}</p>
                <p>Description: {description}</p>
                <p>Coordinates: {coordinates}</p>
                <p>Players: {players}</p>
                <p>Items: {items}</p>
                <p>Exits: [{exits}]</p>
                <p>Cooldown: {cooldown}</p>
                <p>Errors: {errors}</p>
                <p>Mesages: {messages}</p>

                <Form onSubmit={this.moveSubmit}>
                    <Label>You are moving </Label>
                    <Input type='select' value={moveInput} onChange={this.handleInputChange}>
                        <option value='n'>north</option>
                        <option value='s'>south</option>
                        <option value='e'>east</option>
                        <option value='w'>west</option>
                    </Input>
                    <Button type='submit'>Submit</Button>
                </Form>
            </div>
        );
    };
};

export default Traversal;