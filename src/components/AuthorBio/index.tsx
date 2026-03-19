import React from "react";
import { UserPen } from "lucide-react";
import * as style from "./index.module.scss";

const AuthorBio = () => (
  <aside className={style.authorBioWrapper} aria-label="この記事を書いた人">
    <h2 className={style.authorBioHeading}>
      <UserPen
        size={18}
        aria-hidden="true"
        style={{ verticalAlign: "-0.125em" }}
      />
      &nbsp;この記事を書いた人
    </h2>
    <div className={style.authorBio}>
      <div className={style.authorAvatar}>
        <picture>
          <source srcSet="/assets/avater.webp" type="image/webp" />
          <img
            src="/assets/avater.png"
            alt="tubone24"
            width="64"
            height="64"
            loading="lazy"
          />
        </picture>
      </div>
      <div className={style.authorInfo}>
        <strong className={style.authorName}>tubone24</strong>
        <p className={style.authorDescription}>
          AIエージェント開発、Webアプリケーション開発、クラウドインフラに携わるソフトウェアエンジニア。
          「やさしいMCP入門」「AIエージェント開発/運用入門」著者。
        </p>
        <div className={style.authorLinks}>
          <a
            href="https://github.com/tubone24"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com/tubone24"
            target="_blank"
            rel="noopener noreferrer"
          >
            X
          </a>
          <a
            href="https://portfolio.tubone-project24.xyz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portfolio
          </a>
        </div>
      </div>
    </div>
  </aside>
);

export default AuthorBio;
