import React from 'react';

const TimeToRead = ({ html }) => {
  const wordsPerMinutes = 400;
  const words = html.replace(/<code[\s, \S]*?<\/code>/g, '').replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').replace(/\s+/g, '').replace(/#x.*;/, '')
    .replace(/&/, '').length;
  const timeToRead = Math.ceil(words / wordsPerMinutes);
  return (
    <div
      className="countdown"
      style={{
        padding: 5,
        background: '#1bd77f',
      }}
    ><span className="fa-layers fa-fw fa-1x"><span className="icon-clock" /></span>
      この記事は<b>{words}文字</b>で<b>約{timeToRead}分</b>で読めます
    </div>
  );
};

export default TimeToRead;
