import React, { Component } from 'react';
import {isAuthenticated} from '../auth';
import {Redirect} from 'react-router-dom';
// import DefaultProfile from '../images/avatar.png';
import {create} from './apiPost';

class EditProfile extends Component {
    constructor() {
        super()
        this.state = {
            title: '',
            body: '',
            photo: '',
            error: '',
            user: {},
            valueImage: '',
            loading: false,
            redirtectToProfile: false
        }
    };
    
    
    componentDidMount() {
        this.postData = new FormData()
        this.setState({user: isAuthenticated().user});
    };



    isValid = () => {
        const {title, body, valueImage} = this.state;
        if(valueImage.size >  100000) {
            this.setState({error: "File size should be less than 100kb"});
            return false;
        }
        if(title.length === 0 || body.length === 0) {
            this.setState({error: "All fields are required", loading: false});
            return false;
        }
        return true;
    };



    handleChange = (name) => (event) => {
        this.setState({error: ""})
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        if (event.target.files) {
            this.setState({valueImage: value})
        }
        this.postData.set(name, value)
        this.setState({error: ""})
        this.setState({ [name]: value})
    };



    clickSubmit = event => {
        event.preventDefault();
        this.setState({loading: true})
        if (this.isValid()) {            
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            create(userId, token, this.postData)
                .then(data => {
                    if (data.error) {
                        this.setState({error: data.error})
                    } else { 
                        this.setState({loading: false, title: '', body: '', photo: '', redirtectToProfile: true})
                    }
                });
        } 
    };




    newPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Post Photo</label>
                <input onChange={this.handleChange("photo")} type="file" accept="image/*" className="form-control"  />
            </div>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input onChange={this.handleChange("title")} type="text" className="form-control" value={title} />
            </div>
            <div className="form-group">
                <label className="text-muted">Body</label>
                <input onChange={this.handleChange("body")} type="text" className="form-control" value={body} />
            </div>
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Create Post</button>
        </form> 
    )



    render() {
        const {title, body, user, loading, error, redirtectToProfile} = this.state;

        if (redirtectToProfile) {
            return <Redirect  to={`/user/${user._id}`} />
        }

        // const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create a new post</h2>
                
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>

                {loading ? (<div className="jumbotron text-center">
                    <h2>Loading...</h2>
                    </div>
                    ) : (""
                
                    )}
                
                {this.newPostForm(title, body)}
            </div>
        )
    };
};



export default EditProfile;