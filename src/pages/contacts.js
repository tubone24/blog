import React from 'react';
import ReactGA from 'react-ga';
import { navigateTo } from 'gatsby-link';
import Sidebar from '../components/Sidebar';
import SEO from '../components/SEO';

const encode = (data) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
};

export default class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const form = e.target;
    ReactGA.event({
      category: 'User',
      action: 'Submit Contact Form',
    });
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': form.getAttribute('name'),
        ...this.state
      })
    })
      .then(() => navigateTo(form.getAttribute('action')))
      .catch(error => alert(error));
  };

  render() {
    return (
      <div className="container">
        <div
          className="row"
          style={{
            margin: 15,
          }}
        >
          <Sidebar/>
          <div className="col order-2">
            <h1>Contact Form</h1>
            <p>Please your Comment.</p>
            <form
              name="contact"
              method="post"
              action="/thanks/"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={this.handleSubmit}
            >
              {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
              <input type="hidden" name="form-name" value="contact"/>
              <p hidden>
                <label>
                  Don’t fill this out:{' '}
                  <input name="bot-field" onChange={this.handleChange}/>
                </label>
              </p>
              <p>
                <label>
                  Your name:<br/>
                  <input type="text" name="name" class="form-control" maxLength="30" minLength="2" required placeholder="Enter your name" onChange={this.handleChange}/>

                </label>
              </p>
              <p>
                <label>
                  Your email:<br/>
                  <input type="email" name="email" class="form-control" aria-describedby="emailHelp" pattern="^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$" required placeholder="Enter your email" onChange={this.handleChange}/>
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </label>
              </p>
              <p>
                <label>
                  Message:<br/>
                  <textarea name="message" class="form-control" placeholder="Something writing..." onChange={this.handleChange}/>
                </label>
              </p>
              <p>
                <button type="submit" class="btn btn-primary">Send</button>
              </p>
            </form>
          </div>
        </div>
        <SEO
          title="Contacts"
          url="/contacts/"
          siteTitleAlt="tubone BOYAKI"
          isPost={false}
          description="Contact Form Page"
          image="https://i.imgur.com/M795H8A.jpg"
        />
      </div>
    );
  }
}
