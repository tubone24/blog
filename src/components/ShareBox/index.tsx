import React from "react";

import ReactGA from "react-ga4";

import { ChevronUp } from "lucide-react";
import { FacebookIcon, XIcon, HatenaBookmarkIcon } from "@/icons/BrandIcons";

import * as style from "./index.module.scss";

const GotoTopButton = () => (
  <button
    type="button"
    className={style.shareButton + " " + style.top}
    title="トップに戻る"
    data-testid="GotoTopButton"
    onClick={() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      ReactGA.event({
        category: "User",
        action: "Scroll to Top",
      });
    }}
  >
    <ChevronUp size={20} aria-hidden="true" />
    <span className="visually-hidden">トップに戻る</span>
  </button>
);

const ShareBox = ({ url }: { url: string }) => (
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
      <FacebookIcon size={20} />
    </a>
    <a
      href={`https://x.com/intent/post?text=LikeThis:&url=${encodeURI(url)}`}
      title="XでShareする"
      target="_blank"
      rel="noopener noreferrer"
      className={style.shareButton}
      data-testid="x-link"
      onClick={() =>
        ReactGA.event({
          category: "Share",
          action: "X Share",
        })
      }
    >
      <XIcon size={20} />
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
      <HatenaBookmarkIcon size={24} />
    </a>
    <GotoTopButton />
  </div>
);

export default ShareBox;
