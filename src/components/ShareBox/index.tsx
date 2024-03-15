import React from "react";

import ReactGA from "react-ga4";

import * as style from "./index.module.scss";

const CommentButton = () => (
  <a
    className={style.shareButton + " " + style.comment}
    href="#gitalk-container"
    title="コメントする"
    data-testid="CommentButton"
    onClick={() =>
      ReactGA.event({
        category: "User",
        action: "Goto Comment Box",
      })
    }
  >
    <span className="icon-comment" />
  </a>
);

const GotoTopButton = () => (
  <a
    className={style.shareButton + " " + style.top}
    href="#header"
    title="トップに戻る"
    data-testid="GotoTopButton"
    onClick={() => {
      ReactGA.event({
        category: "User",
        action: "Scroll to Top",
      });
    }}
  >
    <span className="icon-chevron-up" />
  </a>
);

const ShareBox = ({
  url,
  hasCommentBox = true,
}: {
  url: string;
  hasCommentBox?: boolean;
}) => (
  <div className={style.mShareBox} role="application" data-testid="share-box">
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(url)}`}
      title="FacebookでShareする"
      target="_blank"
      rel="noopener noreferrer"
      className={style.shareButton}
      data-testid="facebook-link"
      onClick={() =>
        ReactGA.event({
          category: "Share",
          action: "Facebook Share",
        })
      }
    >
      <span className="icon-facebook" />
    </a>
    <a
      href={`https://twitter.com/intent/tweet?text=LikeThis:&url=${encodeURI(
        url
      )}`}
      title="TwitterでShareする"
      target="_blank"
      rel="noopener noreferrer"
      className={style.shareButton}
      data-testid="twitter-link"
      onClick={() =>
        ReactGA.event({
          category: "Share",
          action: "Twitter Share",
        })
      }
    >
      <span className="icon-twitter" />
    </a>
    <a
      href={`http://getpocket.com/edit?url=${encodeURI(url)}`}
      title="Pocketに追加する"
      target="_blank"
      rel="noopener noreferrer"
      className={style.shareButton}
      data-testid="pocket-link"
      onClick={() =>
        ReactGA.event({
          category: "Share",
          action: "Pocket Share",
        })
      }
    >
      <span className="icon-get-pocket" />
    </a>
    <a
      href={`http://b.hatena.ne.jp/add?mode=confirm&url=${encodeURI(url)}`}
      className={style.shareButtonNoBorder}
      data-hatena-bookmark-layout="vertical-normal"
      data-hatena-bookmark-lang="ja"
      title="このエントリーをはてなブックマークに追加"
      data-testid="hatebu-link"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        ReactGA.event({
          category: "Share",
          action: "Hatebu Share",
        })
      }
    >
      <img
        src="/assets/button-only@2x.png"
        alt="hatena bookmark"
        width="30"
        height="30"
      />
    </a>
    {hasCommentBox && <CommentButton />}

    {hasCommentBox && <GotoTopButton />}
  </div>
);

export default ShareBox;
