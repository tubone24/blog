import React, {Component} from 'react'
import 'gitalk/dist/gitalk.css';
const isBrowser = typeof window !== 'undefined';
const Gitalk = isBrowser ? require('gitalk') : undefined;

class GitalkFC extends Component {
  constructor(props) {
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
    GitTalkInstance.render('gitalk-container');
  }
  render() {
    return (<div id="gitalk-container" />);
  }
}

export default GitalkFC
