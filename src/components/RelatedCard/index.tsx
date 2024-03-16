import React from "react";
import { Link, withPrefix } from "gatsby";

import { parseImgur, SizeMapping } from "@/utils/images";

import * as style from "./index.module.scss";
import Tag from "@/components/Tag";

const imageStyle = (headerImage: string) =>
  `${parseImgur(headerImage, SizeMapping.large)}`;

const CardHeader = ({
  url,
  image,
  title,
}: {
  url: string;
  image: string;
  title: string;
}) => (
  <Link to={url}>
    <span className="visually-hidden">{title}</span>
    <div
      className={style.wrapper + " lozad"}
      data-background-image={imageStyle(image)}
    />
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
  tags: readonly (string | null | undefined)[];
  date: string;
  headerImage?: string;
  headerBackgroundColor?: string;
  description?: string;
}) => (
  <div className="col-sm-12 pb-4">
    <Link to={withPrefix(url)}>
      <div className={style.customCard}>
        <div className={style.data}>
          <div className={style.content}>
            <div className={style.stats}>
              <span className={style.date}>{date.split("T")[0]}</span>
              {tags.map((name) => (
                <Tag name={name || ""} key={name} />
              ))}
            </div>
            <CardHeader
              url={withPrefix(url)}
              image={headerImage}
              title={title}
            />
            <Link to={withPrefix(url)}>
              <h4 className={style.title}>{title}</h4>
            </Link>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </Link>
  </div>
);

export default RelatedCard;
