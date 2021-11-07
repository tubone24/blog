import React, {useEffect} from 'react'
const isBrowser = typeof window !== 'undefined';
const Gitalk = isBrowser ? require('gitalk') : undefined;

const GitalkFC = (id, title, clientId, clientSecret) => {
  useEffect(() => {
    const GitTalkInstance = new Gitalk({
      clientID: clientId,
      clientSecret,
      title,
      id,
    });
    GitTalkInstance.render('gitalk-container');
  }, []);
  return (<div id="gitalk-container" />);
}

export default GitalkFC
