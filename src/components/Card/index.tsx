import React from "react";
import { Link, withPrefix } from "gatsby";

import Tag from "../Tag";

import { parseImgur, SizeMapping } from "../../utils/images";

import "./index.scss";

const CardHeader = ({
  url,
  image,
  title,
  index,
}: {
  url: string;
  image: string;
  title: string;
  index: number;
}) => {
  if (index > 1) {
    return (
      <Link to={url}>
        <span className="visually-hidden">{title}</span>
        <div
          className="wrapper lozad"
          data-background-image={parseImgur(image, SizeMapping.large)}
          title={title}
          aria-hidden="true"
        />
      </Link>
    );
  }
  return (
    <Link to={url}>
      <span className="visually-hidden">{title}</span>
      <div
        className="wrapper"
        style={{
          backgroundImage: ` url(${parseImgur(image, SizeMapping.large)})`,
        }}
        title={title}
        aria-hidden="true"
      />
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
}: {
  title: string;
  date: string;
  url: string;
  headerImage: string;
  description: string;
  tags: readonly (string | undefined)[];
  index: number;
}) => (
  <div className="col-sm-12 pb-4">
    <div className="custom-card">
      {headerImage && (
        <CardHeader
          url={withPrefix(url)}
          image={headerImage}
          title={title}
          index={index}
        />
      )}
      <div className="data">
        <div className="content">
          <div className="stats">
            <span className="date">{date?.split("T")[0]}</span>
            {tags.map((name) => (
              <Tag name={name || ""} key={name} />
            ))}
          </div>
          <Link to={withPrefix(url)}>
            <h4 className="title">{title}</h4>
          </Link>
          <p>{description}</p>
          <Link to={withPrefix(url)} aria-hidden="true">
            ....Read more....
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Card;
