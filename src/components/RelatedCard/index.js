import React from 'react';
import { Link, withPrefix } from 'gatsby';

import { parseImgur } from '../../api/images';

import './index.scss';
import Tag from '../Tag';
// const imageStyle = (headerImage, color) => ({
//   backgroundColor: `#${color}`,
//   backgroundImage: ` url(${parseImgur(headerImage, 'large')})`,
// });

const imageStyle = (headerImage) => (
  `${parseImgur(headerImage, 'large')}`
);

const CardHeader = ({ url, image }) => (
  <Link to={url} href={url}>
    <div className="wrapper lozad" data-background-image={imageStyle(image)} />
  </Link>
);

const RelatedCard = ({
  title,
  url,
  tags = [],
  date,
  headerImage,
  headerBackgroundColor,
  description,
}) => (
  <div className="col-sm-12 pb-4">
    <Link to={withPrefix(url)} href={withPrefix(url)}>
      <div className="custom-card">
        <div className="data">
          <div className="content">
            <div className="stats">
              <span className="date">{date.split('T')[0]}</span>
              {tags.map((name) => (
                <Tag name={name} key={name} />
              ))}
            </div>
            <CardHeader
              url={withPrefix(url)}
              image={headerImage}
              backgroundColor={headerBackgroundColor}
            />
            <Link to={withPrefix(url)} href={withPrefix(url)}>
              <h4 className="title">{title}</h4>
            </Link>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </Link>
  </div>
);

RelatedCard.defaultProps = {
  headerImage: '',
  headerBackgroundColor: '',
};

export default RelatedCard;
