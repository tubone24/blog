import React from "react";

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

  // 1枚目はeager loading（LCP）、2枚目以降はnative lazy loading
  return (
    <a href={url} className={index === 0 ? style.imageLink : undefined}>
      <span className="visually-hidden">{title}</span>
      <img
        src={imageUrl}
        alt=""
        className={style.wrapper}
        loading={index === 0 ? "eager" : "lazy"}
        data-testid="card-header"
      />
    </a>
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
        <CardHeader url={url} image={headerImage} title={title} index={index} />
      )}
      <div className={style.data}>
        <div className={style.dataContent}>
          <div className={style.stats}>
            <span className={style.date}>{date?.split("T")[0]}</span>
            {tags.map((name, index) => (
              <Tag name={name || ""} key={`${name}-${index}`} />
            ))}
          </div>
          <a href={url}>
            <h3 className={style.title}>{title}</h3>
          </a>
          <p>{description}</p>
        </div>
      </div>
    </div>
  </div>
);

export default Card;
