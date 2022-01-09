import React, { Component } from "react";
import "@tubone24/gitalk/dist/gitalk.css";
const isBrowser = typeof window !== "undefined";
const Gitalk = isBrowser ? require("@tubone24/gitalk") : undefined;

type Props = {
  id: string;
  title: string;
  clientId: string;
  clientSecret: string;
};

class GitalkFC extends Component<Props> {
  readonly id: string;
  readonly title: string;
  readonly clientId: string;
  readonly clientSecret: string;
  constructor(props: Props) {
    super(props);
    this.id = this.props.id;
    this.title = this.props.title;
    this.clientId = this.props.clientId;
    this.clientSecret = this.props.clientSecret;
  }
  componentDidMount() {
    const GitTalkInstance = new Gitalk({
      clientID: this.clientId,
      clientSecret: this.clientSecret,
      title: this.title,
      id: this.id,
    });
    GitTalkInstance.render("gitalk-container");
  }
  render() {
    return <div id="gitalk-container" />;
  }
}

export default GitalkFC;
