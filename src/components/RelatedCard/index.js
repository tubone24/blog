import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';

import { parseImgur } from '../../api/images';

import './index.scss';
import Tag from "../Tag";

const imageStyle = (headerImage, color) => ({
  backgroundColor: `#${color}`,
  backgroundImage: ` url(${parseImgur(headerImage, 'large')})`,
});

const CardHeader = ({ url, image, backgroundColor }) => (
  <Link to={url} href={url}>
    <div className="wrapper" style={imageStyle(image, backgroundColor)} />
  </Link>
);

const RelatedCard = ({
  title,
  url,
  tags=[],
  date,
  headerImage,
  headerBackgroundColor,
  description,
}) => (
  <div className="col-sm-12 pb-4">
    <Link to={url} href={url}>
      <div className="custom-card">
        <div className="data">
          <div className="content">
            <div className="stats">
              <span className="date">{date.split('T')[0]}</span>
              {tags.map(name => (
                <Tag name={name} key={name} />
              ))}
            </div>
            <CardHeader
              url={url}
              image={headerImage}
              backgroundColor={headerBackgroundColor}
            />
            <Link to={url} href={url}>
              <h4 className="title">{title}</h4>
            </Link>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </Link>
  </div>
);

RelatedCard.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  headerImage: PropTypes.string,
  headerBackgroundColor: PropTypes.string,
  description: PropTypes.string.isRequired,
};

RelatedCard.defaultProps = {
  headerImage: '',
  headerBackgroundColor: '',
};

export default RelatedCard;
