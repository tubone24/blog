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
  const imageUrl = parseImgur(image, SizeMapping.large);

  if (index > 1) {
    return (
      <Link to={url}>
        <span className="visually-hidden">{title}</span>
        <div
          className={style.wrapper + " lozad"}
          data-background-image={imageUrl}
          aria-hidden="true"
          data-testid="card-header"
        />
      </Link>
    );
  }

  // For the first image (LCP), use img tag with eager loading and high priority
  if (index === 0) {
    return (
      <Link to={url} className={style.imageLink}>
        <span className="visually-hidden">{title}</span>
        <img
          src={imageUrl}
          alt=""
          className={style.wrapper}
          loading="eager"
          fetchPriority="high"
          data-testid="card-header"
        />
      </Link>
    );
  }

  // For other early images, keep the existing background-image approach
  return (
    <Link to={url}>
      <span className="visually-hidden">{title}</span>
      <div
        className={style.wrapper}
        style={{
          backgroundImage: ` url(${imageUrl})`,
        }}
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
  tags: readonly (string | undefined)[];
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
          <Link to={withPrefix(url)} aria-label={`${title}の続きを読む`}>
            続きを読む
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Card;
