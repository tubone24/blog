import React, { Component } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';
import ShareBox from '../components/ShareBox';
import SEO from '../components/SEO';

import { config } from '../../data';

const {
  url, name, iconUrl,
} = config;

const shareURL = `${url}/about`;

const html = `
  <h1>Who am I?</h1>
  <img src="https://i.imgur.com/VUti8s3m.png" alt="tubone" title="tubone">
  <span  style="font-size: xx-large; color: #0bbf00; "><b>tubone</b></span> &nbsp; (26)
  <p>はじめまして。<b>tubone</b>と申します。</p>
  <p>本業のITデベロッパーをやる傍ら、写真と音楽をやっています。</p>
  <p>何事も好奇心で始めるタイプです。</p>
  <br />
  <div id="toc_container">
  <b><p class="toc_title">Contents</p></b>
  <ul class="toc_list">
  <li><a href="#cv">1 経歴</a>
  <ul>
    <li><a href="#highschool">1.1 高校時代</a></li>
    <li><a href="#university">1.2 大学時代</a></li>
    <li><a href="#firstCareer">1.3 就職</a></li>
    <li><a href="#secondCareer">1.4 開発</a></li>
  </ul>
  </li>
  <li><a href="#like">2 好きなこと</a></li>
</ul>
</div>
  <h2 id="cv">経歴</h2>
  <h3 id="highschool">高校時代</h3>
  <p><b>暗黒時代</b>。何もない。</p>
  <p>人生で初めてギターを買う。すぐやらなくなる</p>
  <h3 id="university">大学時代</h3>
  <p><b>大学進学</b>を機に<b>東京</b>に出てくる</p>
  <p>塾講師になることを夢見て<b>教育学部</b>に入学する。</p>
  <p>くっそ陰キャなバンドサークルに入り、くっそ陰キャな<b>バンド</b>を始める</p>
  <p>バイトで大学の<b>PC部屋の管理人</b>をやる</p>
  <p>教育学部が嫌になり、他学部の授業を受け始める。<b>美術史と薬学とソフトウェア工学</b>にのめりこむ</p>
  <h3 id="firstCareer">就職</h3>
  <p>IT系の会社に就職する</p>
  <p><b>サーバの保守運用業務</b>になる</p>
  <p>自宅に<b>サーバを買う</b></p>
  <h3 id="secondCareer">開発</h3>
  <p>開発を希望して<b>保守運用業務脱出成功</b>></p>
  <p>社内データ基盤の開発業務で<b>Hadoop</b>に触れる。<b>開発マネジメント業務</b>をする</p>
  <p>開発マネジメントに未来を感じられなくなり<b>AWS</b>での開発案件に移りデベロッパーになる</p>
  <p>今に至る</p>
  <h2 id="like" >好きなこと・もの</h2>
  <ul class="toc_list">
  <li>PC</li>
  <li>プログラミング</li>
  <ul>
  <li>Python</li>
  <li>JavaScript(Vue.js)</li>
  <li>Dart(Flutter)</li>
  <li>Rust</li>
  <li>Nim</li>
  <li>Docker</li>
  </ul>
  <li>PublicCloud</li>
  <ul>
  <li>AWS</li>
  <li>GCP</li>
  <li>Heroku</li>
  </ul>
  <li><a href="/2019/02/13/my-gear#%E3%82%AE%E3%82%BF%E3%83%BC">ギター</a></li>
  <li>アニメ</li>
  <li>写真</li>
  <ul>
  <li>Nikon D600</li>
  </ul>
  <li><a href="/2019/02/13/my-gear#%E3%83%80%E3%83%BC%E3%83%84">ダーツ</a></li>
  <li>ごろごろ</li>
  <li>牛丼</li>
  </ul>
`;

// eslint-disable-next-line react/prefer-stateless-function
class About extends Component {
  render() {
    return (
      <div className="row post order-2">
        <Header
          img="https://i.imgur.com/M795H8A.jpg"
          title="Who is tubone?"
          authorName={name}
          authorImage={iconUrl}
          subTitle="20xx/xx/xx"
        />
        <Sidebar />
        <div className="col-xl-7 col-lg-6 col-md-12 col-sm-12 order-10 content">
          <Content post={html} />

        </div>

        <ShareBox url={shareURL} />

        <SEO
          title="Who is tubone?"
          url={shareURL}
          siteTitleAlt="tubone BOYAKI Profile"
          isPost
          description="About tubone Profile"
          image="https://i.imgur.com/VUti8s3.png"
        />
      </div>
    );
  }
}

export default About;
