import React, { Component } from "react";
import "gitalk/dist/gitalk.css";
import * as style from "./index.module.scss";
const isBrowser = typeof window !== "undefined";
const Gitalk = isBrowser ? require("gitalk") : undefined;

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
      repo: "blog",
      admin: ["tubone24"],
      owner: "tubone24",
      pagerDirection: "first",
      proxy:
        "https://tubone-project24.xyz/.netlify/functions/cors-proxy-github",
      id: this.id,
    });
    GitTalkInstance.render("gitalk-container");
  }
  render() {
    return (
      <div
        className={style.gitalkContainer}
        id="gitalk-container"
        data-testid="gitalk-container"
      />
    );
  }
}

export default GitalkFC;
