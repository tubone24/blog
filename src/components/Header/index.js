import React from 'react';
import './index.scss';

import ReactGA from 'react-ga';
import { parseImgur } from '../../api/images';

const Header = ({
  img,
  title,
  subTitle,
  authorImage,
  authorName,
}) => (
  <div className="col-12 header" style={{ padding: 0 }} id="header">
    <div
      className="img-container"
      style={{
        backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ), url(${img})`,
        marginTop: -58,
      }}
    >
      {title && <h1 className="u-title">{title}</h1>}
      {subTitle && (
      <div className="u-subtitle">
        <div className="m-left">
          {authorImage && (
            <picture>
              <source className="author-image" srcSet="/assets/avater.webp" type="image/webp" onClick={() => ReactGA.event({ category: 'User', action: 'push tubone Avatar' })} />
              <img className="author-image" src="/assets/avater.png" alt={authorName} onClick={() => ReactGA.event({ category: 'User', action: 'push tubone Avatar' })} />
            </picture>
          )}
          <span className="author-name">{authorName}</span>
        </div>
        <span className="text">{subTitle}</span>
      </div>
      )}
    </div>
  </div>
);

Header.defaultProps = {
  title: '',
  subTitle: '',
  authorName: '',
  authorImage: '',
};

export default Header;
