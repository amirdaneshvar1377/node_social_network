import React, { Component } from 'react';
import {isAuthenticated} from '../auth';
import {read, update} from './apiUser';
import {Redirect} from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';
import {updateUser} from './apiUser';


class EditProfile extends Component {
    constructor() {
        super()
        this.state = {
            id: "",
            name: "",
            password: "",
            email: "",
            redirtectToSignin: false,
            error: "",
            fileSize: 0,
            loading: false,
            valueImage: '',
            about: ''
        }
    };



    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token)
        .then(data => {
            if (data.error) {
                this.setState({redirtectToSignin: true})
            } else {
                this.setState({id: data._id, name: data.name, email: data.email, error: '', about: data.about})
            }
        })
    };



    isValid = () => {
        const {name, email, password, valueImage} = this.state;
        if(valueImage.size >  100000) {
            this.setState({error: "File size should be less than 100kb"});
            return false;
        }
        if(name.length === 0) {
            this.setState({error: "Name is required"});
            return false;
        }
        if(!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email)) {
            this.setState({error: "A valid Email is required"});
            return false;
        }
        if(password.length >= 1 && password.length <= 5) {
            this.setState({error: "Password must be at least 6 characters long"});
            return false;
        }
        return true;
    };



    handleChange = (name) => (event) => {
        this.setState({error: ''})
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        if (event.target.files) {
            this.setState({valueImage: value})
        }
        this.userData.set(name, value)
        this.setState({error: ""})
        this.setState({ [name]: value})
    };



    clickSubmit = event => {
        event.preventDefault();
        this.setState({loading: true})
        
        if (this.isValid()) {
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
            update(userId, token, this.userData)
                .then(data => {
                    if (data.error) {
                        this.setState({error: data.error})
                    } else if (isAuthenticated().user.role === "admin") {
                        this.setState({redirectToProfile: true, loading: false});
                    } else { 
                        updateUser(data.user, () => this.setState({redirtectToSignin: true }))                           
                    }
                });
        } else {
            this.setState({loading: false})
        }
    };




    signupForm = (name, email, password, about) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Profile Photo</label>
                <input onChange={this.handleChange("photo")} type="file" accept="image/*" className="form-control"  />
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={this.handleChange("name")} type="text" className="form-control" value={name} />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={this.handleChange("email")} type="email" className="form-control" value={email} />
            </div>
            <div className="form-group">
                <label className="text-muted">About</label>
                <input onChange={this.handleChange("about")} type="textarea" className="form-control" value={about} />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={this.handleChange("password")} type="password" className="form-control" value={password} />
            </div>
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Sumbit</button>
        </form> 
    )


    componentDidMount() {
        this.userData = new FormData()
        const userId = this.props.match.params.userId;
        this.init(userId);
    };



    render() {
        const {id, name, email, password, redirtectToSignin, error, loading, about} = this.state;

        if (redirtectToSignin) {
            return <Redirect  to={`/user/${id}`} />
        }

        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>

                {loading ? (<div className="jumbotron text-center">
                    <h2>Loading...</h2>
                    </div>
                    ) : (""
                
                    )}
                
                <img  style={{height: "200px", width: 'auto'}} className="img-thumbnail"  onError={i => (i.target.src = `${DefaultProfile}`)} src={photoUrl} alt={name} />

                {this.signupForm(name, email, password, about)}
            </div>
        )
    };
};



export default EditProfile;