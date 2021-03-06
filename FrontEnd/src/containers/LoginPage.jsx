import React from 'react';
import PropTypes from 'prop-types';
// import Auth from '../data/Auth';
import LoginForm from '../components/LoginForm.jsx';
var Router = require('react-router');


class LoginPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    // set the initial component state
    this.state = {
      errors: {},
      successMessage,
      user: {
        email: '',
        password: ''
      }
    };
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    event.preventDefault();

    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    fetch('http://localhost:3002/users/login', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then((response) => {
        return (response.json());
      }).then(function (message) {
        console.log(message);
        if (message.success == true) {
          localStorage.setItem('successMessage', message.message);
          //localStorage.setItem('Token',message.token);
          Router.browserHistory.push('/');
          
        } else {
          self.setState({ errors: message.message });
        }

      })

  }


  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <LoginForm
        onSubmit={this.processForm.bind(this)}
        onChange={this.changeUser.bind(this)}
        errors={this.state.errors}
        successMessage={this.state.successMessage}
        user={this.state.user}
      />
    );
  }

}

LoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default LoginPage;
