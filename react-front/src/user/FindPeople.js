import React, { Component } from 'react';
import { findPeople } from './apiUser';
import {Link} from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';
import {isAuthenticated} from '../auth';

class FindPeople extends Component {
    constructor() {
        super()
        this.state = {
            users: []
        }
    };


    componentDidMount() {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        findPeople(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({users: data})
            }
        })
    };

    renderUsers = (users) => (
        <div className="row">
            {users.map((user, i) => (
                <div className="card col-md-4" key={i}>
                <img className="card-img-top" src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} onError={i => (i.target.src = `${DefaultProfile}`)} alt={user.name} style={{width: '100%', height: '15vw', objectFit: 'cover'}} />
                    <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                        <p className="card-text">{user.email}</p>
                        <Link className="btn btn-primary btn-raised bt-sm" to={`/user/${user._id}`}>View Profile</Link>
                    </div>
                </div>
            ))}
        </div>
    )
    

    render() {
        const {users} = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Find People</h2>

                {this.renderUsers(users)}

            </div>
        )
    }
};


export default FindPeople;