import React, {Component} from 'react';
import axios from 'axios';
import Login from './Login';
import config from './Config.json';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            logged: false,
            msgLogin: '',
            msgSignup: ''
        };

        this.handleSignup = this.handleSignup.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        this.onFailure = this.onFailure.bind(this);
        this.facebookResponse = this.facebookResponse.bind(this);
        this.googleResponse = this.googleResponse.bind(this);


    }

    componentDidMount() {
        if(localStorage.getItem('jwtToken')){
          axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        
          axios.get('http://localhost:5000/auth/profile')
            .then(res => {
              this.setState({ name: res.data.user.name, logged: true });
              console.log(res.data.user);
            })
            .catch((error) => {
               console.error(error);
               localStorage.removeItem('jwtToken');
                localStorage.removeItem('name');
                this.setState({logged: false, name: ''});
            });
            
        }
    }

    onFailure(error) {
        console.log(error);
    };

    facebookResponse(response) {  
        console.log(response);     
        axios.post('http://localhost:5000/auth/facebook', {access_token: response.accessToken})
            .then(res => {
                // console.log(res);
                if(res.data.success){
                    console.log(res);
                    axios.defaults.headers.common['Authorization'] = res.data.token;
                    localStorage.setItem('jwtToken', res.data.token);
                    localStorage.setItem('name', res.data.name);
                    this.setState({name : res.data.name, logged: true});

                }
              })
            .catch((error) => {
                console.log(error);
            });
        
    };

    googleResponse(response) {
      console.log(response);
        axios.post('http://localhost:5000/auth/google', {access_token: response.accessToken})
            .then(res => {
                // console.log(res);
                if(res.data.success){
                    console.log(res);
                    axios.defaults.headers.common['Authorization'] = res.data.token;
                    localStorage.setItem('jwtToken', res.data.token);
                    localStorage.setItem('name', res.data.name);
                    this.setState({name : res.data.name, logged: true});

                }
              })
            .catch((error) => {
                console.log(error);
            });
    };

    handleSignup(body) {
      axios.post('http://localhost:5000/auth/signup', body)
            .then(res => {
                // console.log(res);
                if(res.data.success){
                    console.log(res);
                    axios.defaults.headers.common['Authorization'] = res.data.token;
                    localStorage.setItem('jwtToken', res.data.token);
                    localStorage.setItem('name', res.data.name);
                    this.setState({name : res.data.name, logged: true});

                }
              })
            .catch((error) => {
                console.log(error);
                this.setState({msgLogin : error.response.data.msg});
            });
    }

    handleLogin(body) {
        axios.post('http://localhost:5000/auth/login', body)
            .then(res => {
                    // console.log(res);
                if(res.data.success){
                    console.log(res);
                    axios.defaults.headers.common['Authorization'] = res.data.token;
                    localStorage.setItem('jwtToken', res.data.token);
                    localStorage.setItem('name', res.data.name);
                    this.setState({name : res.data.name, logged: true});

                }
              })
            .catch((error) => {
                this.setState({msgLogin : error.response.data.msg});
            });
    }

    handleLogout(e){
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('name');
        this.setState({logged: false, name: ''});
        window.location.reload();
    }

    render() {
        let displayComponent = 
              <div>
                <Login handleLogin={this.handleLogin} handleSignup={this.handleSignup}
                loginmsg={this.state.msgLogin} signupmsg={this.state.msgSignup}/>
                <FacebookLogin
                      appId={config.FACEBOOK_APP_ID}
                      autoLoad={false}
                      fields="name,email,picture"
                      callback={this.facebookResponse} />
                <GoogleLogin
                      clientId={config.GOOGLE_CLIENT_ID}
                      buttonText="Login"
                      onSuccess={this.googleResponse}
                      onFailure={this.onFailure} />
                </div>

        if(this.state.logged){
            displayComponent = 
                <div className="jumbotron">
                  <h3> {this.state.name} </h3>
                  <input value="LOG OUT" type="button" onClick={this.handleLogout}/>
                </div>;
        }

        return (
          <div>
            {displayComponent}
            </div>
        )
    }
}