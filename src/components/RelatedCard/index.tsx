import React from "react";
import { Link, withPrefix } from "gatsby";

import { parseImgur, SizeMapping } from "../../utils/images";

import "./index.scss";
import Tag from "../Tag";

const imageStyle = (headerImage: string) =>
  `${parseImgur(headerImage, SizeMapping.large)}`;

const CardHeader = ({ url, image }: { url: string; image: string }) => (
  <Link to={url}>
    <div className="wrapper lozad" data-background-image={imageStyle(image)} />
  </Link>
);

const RelatedCard = ({
  title,
  url,
  tags = [],
  date,
  headerImage = "",
  description,
}: {
  title: string;
  url: string;
  tags: readonly (string | undefined)[];
  date: string;
  headerImage?: string;
  headerBackgroundColor?: string;
  description?: string;
}) => (
  <div className="col-sm-12 pb-4">
    <Link to={withPrefix(url)}>
      <div className="custom-card">
        <div className="data">
          <div className="content">
            <div className="stats">
              <span className="date">{date.split("T")[0]}</span>
              {tags.map((name) => (
                <Tag name={name || ""} key={name} />
              ))}
            </div>
            <CardHeader url={withPrefix(url)} image={headerImage} />
            <Link to={withPrefix(url)}>
              <h4 className="title">{title}</h4>
            </Link>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </Link>
  </div>
);

export default RelatedCard;
