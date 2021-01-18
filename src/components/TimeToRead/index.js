import React from 'react';

const TimeToRead = ({ html }) => {
  // Japanese can read about 400 characters per minute.
  // https://homepage-reborn.com/2015/06/10/%E4%BA%BA%E3%81%AF%EF%BC%91%E5%88%86%E9%96%93%E3%81%AB%E4%BD%95%E6%96%87%E5%AD%97%E8%AA%AD%E3%82%81%E3%82%8B%E3%81%AE%EF%BC%9F%E3%82%B9%E3%82%AD%E3%83%9E%E6%99%82%E9%96%93%E3%81%A7%E8%AA%AD%E3%81%BE/#:~:text=%E6%B8%AC%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%88%E3%81%86%EF%BC%81-,%E6%97%A5%E6%9C%AC%E4%BA%BA%E3%81%AE%EF%BC%91%E5%88%86%E9%96%93%E3%81%AB%E8%AA%AD%E3%82%81%E3%82%8B%E6%96%87%E5%AD%97%E6%95%B0%E3%81%AE%E5%B9%B3%E5%9D%87,400%E3%80%9C600%E5%AD%97%E3%81%A8%E3%81%97%E3%81%BE%E3%81%99%E3%80%82
  const words = html.replace(/<code[\s, \S]*?<\/code>/g, '').replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').replace(/\s+/g, '').replace(/#x.*;/, '')
    .replace(/&/, '').length;
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
