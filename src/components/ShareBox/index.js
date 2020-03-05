import React from 'react';

import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './index.scss';

const CommentButton = () => (
  <a
    className="share-button"
    style={{
      lineHeight: '1.7rem',
      color: '#337ab7',
      paddingLeft: '0.15rem',
    }}
    href="#gitalk-container"
    onClick={() => ReactGA.event({
      category: 'User',
      action: 'Goto Comment Box',
    })
    }
  >
    <FontAwesomeIcon icon={['far', 'comment']} />
  </a>
);

const GotoTopButton = () => (
  <a
    className="share-button"
    href="#header"
    onClick={() => {
      ReactGA.event({
        category: 'User',
        action: 'Scroll to Top',
      });
    }}
    style={{
      lineHeight: '1.7rem',
      paddingLeft: '0.1rem',
    }}
  >
    <FontAwesomeIcon icon={['fas', 'chevron-up']} />
  </a>
);

const ShareBox = ({ url, hasCommentBox }) => (
  <div className="m-share-box">
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
      title="FacebookでShareする"
      target="_blank"
      rel="noopener noreferrer"
      className="share-button"
      onClick={() => ReactGA.event({
        category: 'Share',
        action: 'Facebook Share',
      })
      }
    >
      <FontAwesomeIcon icon={['fab', 'facebook-f']} />
    </a>
    <a
      href={`https://twitter.com/intent/tweet?text=LikeThis:&url=${url}`}
      title="TwitterでShareする"
      target="_blank"
      rel="noopener noreferrer"
      className="share-button"
      onClick={() => ReactGA.event({
        category: 'Share',
        action: 'Twitter Share',
      })
      }
    >
      <FontAwesomeIcon icon={['fab', 'twitter']} />
    </a>
    <a
      href={`http://getpocket.com/edit?url=${url}`}
      title="Pocketに追加する"
      target="_blank"
      rel="noopener noreferrer"
      className="share-button"
      onClick={() => ReactGA.event({
        category: 'Share',
        action: 'Pocket Share',
      })
      }
    >
      <FontAwesomeIcon icon={['fab', 'get-pocket']} />
    </a>
    <a
      href={`http://b.hatena.ne.jp/add?mode=confirm&url=${url}`}
      className="hatena-bookmark-button"
      data-hatena-bookmark-layout="vertical-normal"
      data-hatena-bookmark-lang="ja"
      title="このエントリーをはてなブックマークに追加"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => ReactGA.event({
        category: 'Share',
        action: 'Hatebu Share',
      })
      }
    >
      <img
        src="//b.st-hatena.com/images/entry-button/button-only@2x.png"
        alt=""
        width="25"
        height="25"
        style={{ position: 'absolute', top: 10 }}
      />
    </a>
    {hasCommentBox && <CommentButton />}

    {hasCommentBox && <GotoTopButton />}
  </div>
);

ShareBox.propTypes = {
  url: PropTypes.string.isRequired,
  hasCommentBox: PropTypes.bool,
};

ShareBox.defaultProps = {
  hasCommentBox: true,
};

export default ShareBox;
