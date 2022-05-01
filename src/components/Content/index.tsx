import React, { Component } from "react";
import lozad from "lozad";

import { isBrowser } from "../../utils";
import "./index.scss";

type Props = {
  post: string;
};

class Content extends Component<Props> {
  private post: string;
  constructor(props: Props) {
    super(props);
    const { post } = this.props;
    this.post = post;
  }

  componentDidMount() {
    // lazy loads elements with default selector as '.lozad'
    // Prevent WebPack build fail
    if (isBrowser()) {
      // Initialize library
      const observer = lozad(".lozad", {
        load(el) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          el.src = el.dataset.src;
          if (el.getAttribute("data-background-image")) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            el.style.backgroundImage = el.getAttribute("data-background-image");
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          el.onload = () => {
            el.classList.add("animated");
            el.classList.add("fadeIn");
          };
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
          className="content-white-inner"
          dangerouslySetInnerHTML={{ __html: post }}
        />
        <div className="content-white-inner">
          <h2>tubone24にラーメンを食べさせよう！</h2>
          <p>ぽちっとな↓</p>
          <a href="https://www.buymeacoffee.com/tubone24">
            <img
              src="https://img.buymeacoffee.com/button-api/?text=Buy me a ramen&emoji=🍜&slug=tubone24&button_colour=40DCA5&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00"
              alt="Buy me a ramen"
            />
          </a>
        </div>
      </>
    );
  }
}

export default Content;
