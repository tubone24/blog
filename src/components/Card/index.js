import React from 'react';
import { Link, withPrefix } from 'gatsby';
// import PropTypes from 'prop-types';

import Tag from '../Tag';

import { parseImgur } from '../../api/images';

import './index.scss';

const imageStyle = (headerImage) => ({
  backgroundImage: ` url(${parseImgur(headerImage, 'large')})`,
});

const imageStyleLazy = (headerImage) => (
  `${parseImgur(headerImage, 'large')}`
);

const CardHeader = ({ url, image, index }) => {
  if (index > 1) {
    return (
      <Link to={url} href={url}>
        <div className="wrapper lazyload" data-bg={imageStyleLazy(image)} />
      </Link>
    );
  }
  return (
    <Link to={url} href={url}>
      <div className="wrapper" style={imageStyle(image)} />
    </Link>
  );
};


const Card = ({
  title,
  date,
  url,
  headerImage,
  description,
  tags = [],
  index,
}) => (
  <div className="col-sm-12 pb-4">
    <div className="custom-card">
      {headerImage && (
        <CardHeader
          url={withPrefix(url)}
          image={headerImage}
          index={index}
        />
      )}
      <div className="data">
        <div className="content">
          <div className="stats">
            <span className="date">{date.split('T')[0]}</span>
            {tags.map((name) => (
              <Tag name={name} key={name} />
            ))}
          </div>
          <Link to={ withPrefix(url) } href={ withPrefix(url) }>
            <h4 className="title">{title}</h4>
          </Link>
          <p>{description}</p>
          <Link to={withPrefix(url)} href={withPrefix(url)} title="....Read more....">....Read more....</Link>
        </div>
      </div>
    </div>
  </div>
);

// Card.propTypes = {
//   title: PropTypes.string.isRequired,
//   date: PropTypes.string,
//   url: PropTypes.string.isRequired,
//   headerImage: PropTypes.string,
//   headerBackgroundColor: PropTypes.string,
//   description: PropTypes.string.isRequired,
//   tags: PropTypes.arrayOf(PropTypes.string),
// };
//
// CardHeader.propTypes = Card.propTypes;
//
// Card.defaultProps = {
//   headerImage: '',
//   tags: [],
//   date: '',
//   headerBackgroundColor: '',
// };

export default Card;
