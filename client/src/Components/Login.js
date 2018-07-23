import React, {Component} from 'react';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          signupname: '',
          signupemail : '',
          signuppassword: '',
          loginemail : '',
          loginpassword: '',
          signupmsg: '',
          loginmsg: ''
        };

        this.handleSignupName = this.handleSignupName.bind(this);
        this.handleSignupEmail = this.handleSignupEmail.bind(this);
        this.handleSignupPassword = this.handleSignupPassword.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.handleLoginEmail = this.handleLoginEmail.bind(this);
        this.handleLoginPassword = this.handleLoginPassword.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleSignupName(e) {
        this.setState({ signupname: e.target.value});
      }

      handleSignupEmail(e) {
        this.setState({ signupemail: e.target.value});
      }

      handleSignupPassword(e) {
        this.setState({ signuppassword: e.target.value });
      }

      handleSignup(e) {
        if(this.state.signupemail && this.state.signuppassword && this.state.signupname){
          this.props.handleSignup({name: this.state.signupname, email: this.state.signupemail, password: this.state.signuppassword});
        }
      }

      handleLoginEmail(e) {
        this.setState({ loginemail: e.target.value});
      }

      handleLoginPassword(e) {
        this.setState({ loginpassword: e.target.value });
      }

      handleLogin(e) {
        if(this.state.loginemail && this.state.loginpassword){
          this.props.handleLogin({email: this.state.loginemail, password: this.state.loginpassword});
        }
      }

    render() {
        return (
            <div className="container-fluid jumbotron">
                <div className="row">
                      <div className="col-md-6">
                          <div>
                            <div className="row">
                              <div className="col-md-8">
                                  <label htmlFor="loginemail">Email</label>
                                  <input placeholder="Email" type="text" className="form-control" value={this.state.loginemail}
                                         onChange={this.handleLoginEmail}  id="loginemail"/>
                              </div>
                              <div className="col-md-8">
                                  <label htmlFor="loginpassword">Password</label>
                                  <input placeholder="Password" onChange={this.handleLoginPassword} type="password"
                                         className="form-control" id="loginpassword" value={this.state.loginpassword}/>
                                  <h5> {this.props.loginmsg}</h5>
                              </div>
                              <br/>
                              <div className="col-md-8">
                                  <input type="button" value="LOG IN" onClick={this.handleLogin}/>

                              </div>
                            </div>
                          </div>

                      </div>
                      <div className="col-md-6">
                        <div className="col-md-8">
                              <label htmlFor="name">Name</label>
                              <input placeholder="name" onChange={this.handleSignupName} type="text"
                                     className="form-control" id="name" value={this.state.signupname}/>

                          </div>
                          <div className="col-md-8">
                              <label htmlFor="signupEmail">Email</label>
                              <input placeholder="Email" type="text" className="form-control" value={this.state.signupemail}
                                     onChange={this.handleSignupEmail}  id="signupEmail"/>
                          </div>
                          <div className="col-md-8">
                              <label htmlFor="signuppassword">Password</label>
                              <input placeholder="Password" onChange={this.handleSignupPassword} type="password"
                                     className="form-control" id="signuppassword" value={this.state.signuppassword}/>
                              <h5> {this.props.signupmsg}</h5>
                          </div>
                          <br/>
                          <div className="col-md-8">
                              <input type="button" value="SIGN UP" onClick={this.handleSignup}/>
                          </div>
                      </div>
                  </div>
            </div>
        )
    }
}
