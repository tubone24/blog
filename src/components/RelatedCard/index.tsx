import React from "react";

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
  <a href={url}>
    <span className="visually-hidden">{title}</span>
    <div
      className={style.wrapper + " lozad"}
      data-background-image={imageStyle(image)}
    />
  </a>
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
    <a href={url}>
      <div className={style.customCard}>
        <div className={style.data}>
          <div className={style.content}>
            <div className={style.stats}>
              <span className={style.date}>{date.split("T")[0]}</span>
              {tags.map((name) => (
                <Tag name={name || ""} key={name} />
              ))}
            </div>
            <CardHeader url={url} image={headerImage} title={title} />
            <a href={url}>
              <h4 className={style.title}>{title}</h4>
            </a>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </a>
  </div>
);

export default RelatedCard;
