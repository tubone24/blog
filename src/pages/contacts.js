import React from 'react';
import ReactGA from 'react-ga';
import { navigateTo } from 'gatsby-link';
import Sidebar from '../components/Sidebar';
import SEO from '../components/SEO';

import './contacts.scss';

export default class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  encode = (data) => {
    const formData = new FormData();
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(data)) {
      formData.append(key, data[key]);
    }
    return formData;
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleAttachment = (e) => {
    this.setState({ [e.target.name]: e.target.files[0] });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    ReactGA.event({
      category: 'User',
      action: 'Submit Contact Form',
    });
    fetch('https://getform.io/f/897f187e-876d-42a7-b300-7c235af72e6d', {
      method: 'POST',
      body: this.encode({
        'form-name': form.getAttribute('name'),
        ...this.state,
      }),
    })
      .then(() => navigateTo(form.getAttribute('action')))
      .catch((error) => alert(error));
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
          <Sidebar />
          <div className="col order-2 contactForm">
            <h1><span className="icon-envelope" />&nbsp;Contact Form</h1>
            <p><b>Please your Comment here.</b></p>
            <br />

            <form
              name="contact"
              method="post"
              action="/thanks/"
              onSubmit={this.handleSubmit}
            >
              {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
              <input type="hidden" name="form-name" value="contact" />
              <p hidden>
                <label>
                  Don’t fill this out:{' '}
                  <input name="bot-field" onChange={this.handleChange} />
                </label>
              </p>
              <p>
                <label>
                  <span className="icon-user" />&nbsp;Your name<br />
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    maxLength="30"
                    minLength="2"
                    required
                    placeholder="Enter your name"
                    onChange={this.handleChange}
                  />

                </label>
              </p>
              <p>
                <label>
                  <span className="icon-envelope" />&nbsp;Your email<br />
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    aria-describedby="emailHelp"
                    pattern="^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
                    required
                    placeholder="Enter your email"
                    onChange={this.handleChange}
                  />
                  <small id="emailHelp" className="form-text text-muted">We&apos;ll never share your
                    email with anyone else.
                  </small>
                </label>
              </p>
              <p>
                <label>
                  Subject<br />
                  <input
                    type="text"
                    name="subject"
                    className="form-control"
                    maxLength="30"
                    cols="50"
                    placeholder="Subject here..."
                    onChange={this.handleChange}
                  />

                </label>
              </p>
              <p>
                <label>
                  Message<br />
                  <textarea
                    name="message"
                    className="form-control"
                    placeholder="Something writing..."
                    rows="6"
                    cols="50"
                    onChange={this.handleChange}
                  />
                </label>
              </p>
              <p>
                File<br />
                <label className="input-group-btn">
                  <span className="btn btn-info">
                    <span className="icon-file" />
                    &nbsp;Attachment File<input
                      type="file"
                      name="file"
                      className="file-upload"
                      onChange={this.handleAttachment}
                    />
                    <small id="fileHelp" className="form-text">Please Attachment File Size less small as possible</small>
                  </span>
                </label>
              </p>
              <p>
                <br />
                <button type="submit" className="btn btn-primary">Send&nbsp;<span className="icon-angle-right" /></button>
              </p>
            </form>
          </div>
        </div>
        <SEO
          title="Contacts"
          url="https://blog.tubone-project24.xyz/contacts/"
          siteTitleAlt="tubone BOYAKI"
          isPost={false}
          description="Contact Form Page"
          tag=""
          image="https://i.imgur.com/M795H8A.jpg"
        />
      </div>
    );
  }
}
