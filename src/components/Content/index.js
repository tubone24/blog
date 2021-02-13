import React, { Component } from 'react';
import lozad from 'lozad';

import { isBrowser } from '../../api';

class Content extends Component {
  constructor(props) {
    super(props);
    const { post } = this.props;
    this.post = post;
  }

  componentDidMount() {
    // lazy loads elements with default selector as '.lozad'
    // Prevent WebPack build fail
    if (isBrowser()) {
      // Initialize library
      const observer = lozad('.lozad', {
        load(el) {
          /* eslint-disable no-param-reassign */
          el.src = el.dataset.src;
          if (el.getAttribute('data-background-image')) {
            el.style.backgroundImage = el.getAttribute('data-background-image');
          }
          el.onload = () => {
            el.classList.add('animated');
            el.classList.add('fadeIn');
          };
          /* eslint-enable */
        },
      });
      observer.observe();
    }
  }

  render() {
    const { post } = this.props;
    return (
      <>
        <div
        // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: post.replace(/<img[\s|\S]src=/g, '<img class="lozad" src="data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7" data-src=') }}
          style={{
            padding: 30,
            background: 'white',
          }}
        />
        <div style={{
          padding: 30,
          background: 'white',
        }}
        >
          <h2>tubone24にラーメンを食べさせよう！</h2>
          <p>ぽちっとな↓</p>
          <a href="https://www.buymeacoffee.com/tubone24">
            <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a ramen&emoji=🍜&slug=tubone24&button_colour=40DCA5&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00" alt="Buy me a ramen" />
          </a>
        </div>
      </>
    );
  }
}

export default Content;
