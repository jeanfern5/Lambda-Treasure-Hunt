import React, { Component } from 'react';
import axios from 'axios';
// require('dotenv').config()


class Init extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "room_id": 0,
            "title": "Room 0",
            "description": "You are standing in an empty room.",
            "coordinates": "(60,60)",
            "players": [],
            "items": ["small treasure"],
            "exits": ["n", "s", "e", "w"],
            "cooldown": 60.0,
            "errors": [],
            "messages": []
        };
    };

    componentDidMount() {
        let config = {
            headers: { 'Authorization': process.env.Token }
        };

        axios   
            .get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', config)
            .then(res => {
                if (res.status === 200) {
                    console.log('HERE', res.data, res)
                    this.setState({
                        room_id: res.data.room_id
                    })
                }
            })

    };
 
    render() {
        return(
            <h1>Room ID: {this.state.room_id}</h1>
        );
    };
};
export default Init;