import React from "react";
import { Link, withPrefix } from "gatsby";

import Tag from "@/components/Tag";

import { parseImgur, SizeMapping } from "@/utils/images";

import * as style from "./index.module.scss";

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
          className={style.wrapper + " lozad"}
          data-background-image={parseImgur(image, SizeMapping.large)}
          title={title}
          aria-hidden="true"
          data-testid="card-header"
        />
      </Link>
    );
  }
  return (
    <Link to={url}>
      <span className="visually-hidden">{title}</span>
      <div
        className={style.wrapper}
        style={{
          backgroundImage: ` url(${parseImgur(image, SizeMapping.large)})`,
        }}
        title={title}
        aria-hidden="true"
        data-testid="card-header"
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
  headerImage?: string;
  description: string;
  tags: readonly (string | null | undefined)[];
  index: number;
}) => (
  <div className="col-sm-12 pb-4" data-testid="card">
    <div className={style.customCard}>
      {headerImage && (
        <CardHeader
          url={withPrefix(url)}
          image={headerImage}
          title={title}
          index={index}
        />
      )}
      <div className={style.data}>
        <div className={style.dataContent}>
          <div className={style.stats}>
            <span className={style.date}>{date?.split("T")[0]}</span>
            {tags.map((name, index) => (
              <Tag name={name || ""} key={`${name}-${index}`} />
            ))}
          </div>
          <Link to={withPrefix(url)}>
            <h3 className={style.title}>{title}</h3>
          </Link>
          <p>{description}</p>
          <Link to={withPrefix(url)}>....Read more....</Link>
        </div>
      </div>
    </div>
  </div>
);

export default Card;
