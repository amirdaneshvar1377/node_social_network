import React, {Component} from 'react';
import {singlePost, update} from './apiPost';
import {isAuthenticated} from '../auth';
import {Redirect} from 'react-router-dom';
import DefaultPost from '../images/mountains.jpg';

class EditPost extends Component {
    constructor() {
        super()
        this.state = {
            id: '',
            title: '',
            body: '',
            redirtectToProfile: false,
            error: '',
            valueImage: '',
            loading: false
        }
    };


    init = postId => {
        singlePost(postId)
        .then(data => {
            if (data.error) {
                this.setState({redirtectToSignin: true})
            } else {
                this.setState({id: data._id, title: data.title, body: data.body, error: ''})
            }
        })
    };


    componentDidMount() {
        this.postData = new FormData()
        const postId = this.props.match.params.postId;
        this.init(postId);
    };



    isValid = () => {
        const {title, body, valueImage} = this.state;
        if(valueImage.size >  100000) {
            this.setState({error: "File size should be less than 100kb", loading: false});
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
            const postId = this.state.id;
            const token = isAuthenticated().token;
            update(postId, token, this.postData)
                .then(data => {
                    if (data.error) {
                        this.setState({error: data.error})
                    } else { 
                        this.setState({loading: false, title: '', body: '', photo: '', redirtectToProfile: true})
                    }
                });
        } 
    };


    editPostForm = (title, body) => (
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
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Update Post</button>
        </form> 
    )



    render() {
        const {id, title, body, redirtectToProfile, error, loading} = this.state;

        if (redirtectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">{title}</h2>

                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>

                {loading ? (<div className="jumbotron text-center">
                    <h2>Loading...</h2>
                    </div>
                    ) : (""
                
                    )}

                <img  style={{height: "200px", width: 'auto'}} className="img-thumbnail"  onError={i => (i.target.src = `${DefaultPost}`)} src={`${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`} alt={title} />

                {this.editPostForm(title, body)}
            </div>
        )
    }
};


export default EditPost