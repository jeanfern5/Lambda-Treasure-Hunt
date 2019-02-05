import React, { Component } from 'react';
import axios from 'axios';
import { Input, Form, Label, Button } from 'reactstrap';
import { config, globalURL} from '../env'
class LocationInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "room_id": "",
            "title": "",
            "description": "",
            "coordinates": "",
            "players": [],
            "items": [],
            "exits": [],
            "cooldown": "",
            "errors": [],
            "messages": [],
            "input": ""
        };
    };

    componentDidMount() {
        axios   
            .get(`${globalURL}/init`, config)
            .then(res => {
                console.log('HERE', res)
                this.setState({
                    room_id: res.data.room_id,
                    title: res.data.title,
                    description: res.data.description,
                    coordinates: res.data.coordinates,
                    players: res.data.players,
                    items: res.data.items,
                    exits: res.data.exits,
                    cooldown: res.data.cooldown,
                    errors: res.data.errors,
                    messages: res.data.messages
                });
            })
            .catch(err => {
                console.log('ERROR with INIT URL', err)
            });
    };

    handleInputChange = e => {
        this.setState({ input: e.target.value });
    };

    moveSubmit = e => {
        e.preventDefault();

        const { input } = this.state;    
        const moveInput = {direction: input}

        switch (input.toLocaleLowerCase()) {
            case 'n':
            case 'e':
            case 'w':
            case 's':
                axios
                    .post(`${globalURL}/move`, moveInput, config)
                    .then(res => {
                        console.log('THERE', res.data)
                        this.setState({                    
                            room_id: res.data.room_id,
                            title: res.data.title,
                            description: res.data.description,
                            coordinates: res.data.coordinates,
                            players: res.data.players,
                            items: res.data.items,
                            exits: res.data.exits,
                            cooldown: res.data.cooldown,
                            errors: res.data.errors,
                            messages: res.data.messages
                        });
                    })
                    .catch(err => {
                        console.log('ERROR with MOVE URL', err)
                    }); 
                return;
            default:
                return;
        }
    };
 
    render() {
        const { moveInput } = this.state;
        return(
            <div>
                <p>Room ID: {this.state.room_id}</p>
                <p>Title: {this.state.title}</p>
                <p>Description: {this.state.description}</p>
                <p>Coordinates: {this.state.coordinates}</p>
                <p>Players: {this.state.players}</p>
                <p>Items: {this.state.items}</p>
                <p>Exits: {this.state.exits}</p>
                <p>Cooldown: {this.state.cooldown}</p>
                <p>Errors: {this.state.errors}</p>
                <p>Mesages: {this.state.messages}</p>

                <Form onSubmit={this.moveSubmit}>
                    <Label>You are moving </Label>
                    <Input type='select' value={moveInput} onChange={this.handleInputChange}>
                        <option value='n'>up</option>
                        <option value='s'>down</option>
                        <option value='e'>right</option>
                        <option value='w'>left</option>
                    </Input>
                    <Button type='submit'>Submit</Button>
                </Form>
            </div>
        );
    };
};

export default LocationInfo;