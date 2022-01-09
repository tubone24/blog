import React from "react";

import ReactGA from "react-ga";

import "./index.scss";

const CommentButton = () => (
  <a
    className="share-button"
    style={{
      lineHeight: "1.7rem",
      color: "#337ab7",
      paddingLeft: "0.15rem",
    }}
    href="#gitalk-container"
    title="コメントする"
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
    className="share-button"
    href="#header"
    title="トップに戻る"
    onClick={() => {
      ReactGA.event({
        category: "User",
        action: "Scroll to Top",
      });
    }}
    style={{
      lineHeight: "1.7rem",
      paddingLeft: "0.1rem",
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
  <div className="m-share-box">
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
      title="FacebookでShareする"
      target="_blank"
      rel="noopener noreferrer"
      className="share-button"
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
      href={`https://twitter.com/intent/tweet?text=LikeThis:&url=${url}`}
      title="TwitterでShareする"
      target="_blank"
      rel="noopener noreferrer"
      className="share-button"
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
      href={`http://getpocket.com/edit?url=${url}`}
      title="Pocketに追加する"
      target="_blank"
      rel="noopener noreferrer"
      className="share-button"
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
      href={`http://b.hatena.ne.jp/add?mode=confirm&url=${url}`}
      className="hatena-bookmark-button"
      data-hatena-bookmark-layout="vertical-normal"
      data-hatena-bookmark-lang="ja"
      title="このエントリーをはてなブックマークに追加"
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
        width="25"
        height="25"
        style={{ position: "absolute", top: 10 }}
      />
    </a>
    {hasCommentBox && <CommentButton />}

    {hasCommentBox && <GotoTopButton />}
  </div>
);

export default ShareBox;
