import React from 'react';

const TimeToRead = ({ words }) => {
  return (
    <div
      className="countdown"
      style={{
        padding: 5,
        background: '#1bd77f',
      }}
    ><span className="fa-layers fa-fw fa-1x"><span className="icon-clock" /></span>
      この記事は<b>{words}文字</b>で<b>約{Math.ceil(words / 400)}分</b>で読めます
    </div>
  );
};

export default TimeToRead;
