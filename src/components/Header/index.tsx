import React from "react";
import * as style from "./index.module.scss";

import ReactGA from "react-ga4";

const Header = ({
  img = "",
  title = "",
  subTitle = "",
  authorImage = true,
  authorName = "",
}: {
  img?: string;
  title?: string;
  subTitle?: string;
  authorImage?: boolean;
  authorName?: string;
}) => (
  <div
    className="col-12 header"
    style={{ padding: 0 }}
    id="header"
    data-testid="header"
  >
    <div
      className={style.imgContainer}
      style={{
        backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ), url(${img})`,
      }}
    >
      {title && <h1 className={style.uTitle}>{title}</h1>}
      {subTitle && (
        <div className={style.uSubtitle}>
          <div className={style.mLeft}>
            {authorImage && (
              <picture>
                <source
                  className={style.authorImage}
                  srcSet="/assets/avater.webp"
                  type="image/webp"
                  onClick={() =>
                    ReactGA.event({
                      category: "User",
                      action: "push tubone Avatar",
                    })
                  }
                />
                <img
                  className={style.authorImage}
                  src="/assets/avater.png"
                  alt={authorName}
                  fetchPriority="high"
                  onClick={() =>
                    ReactGA.event({
                      category: "User",
                      action: "push tubone Avatar",
                    })
                  }
                />
              </picture>
            )}
            <span className={style.authorName}>{authorName}</span>
          </div>
          <span className={style.text}>{subTitle}</span>
        </div>
      )}
    </div>
  </div>
);

export default Header;
