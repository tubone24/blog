import React from 'react';
import { Link, withPrefix } from 'gatsby';

import Tag from '../Tag';

import { parseImgur } from '../../api/images';

import './index.scss';

const imageStyleLazy = (headerImage) => (
  `${parseImgur(headerImage, 'large')}`
);

const CardHeader = ({ url, image }) => (
  <Link to={url} href={url}>
    <div className="wrapper lozad" data-background-image={imageStyleLazy(image)} />
  </Link>
);

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
          <Link to={withPrefix(url)} href={withPrefix(url)} title={title}>
            <h4 className="title">{title}</h4>
          </Link>
          <p>{description}</p>
          <Link to={withPrefix(url)} href={withPrefix(url)} title="....Read more....">....Read more....</Link>
        </div>
      </div>
    </div>
  </div>
);

export default Card;
