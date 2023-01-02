import React, { Component } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Content from "@/components/Content";
import ShareBox from "@/components/ShareBox";
import SEO from "@/components/SEO";
import * as style from "./about.module.scss";

const html = `
  <h1>Who am I?</h1>
  <img src="https://i.imgur.com/VUti8s3m.png" alt="tubone" title="tubone">
  <span  style="font-size: xx-large; color: #0bbf00; "><b>tubone</b></span> &nbsp; (29)
  <p>はじめまして。<b>tubone</b>と申します。</p>
  <p>本業のソフトウェア開発をやる傍ら、写真と音楽をやっています。</p>
  <p>何事も好奇心で始めるタイプです。</p>
  <br />
  <h2>技術的傾向</h2>
  <h3>Languages</h3>
  <figure><embed src="https://wakatime.com/share/@tubone/9afcad3b-1d40-4107-8ac0-f855cfd0d74d.svg"/></figure>
  <h3>Code Activity</h3>
  <figure><embed src="https://wakatime.com/share/@tubone/93a178e7-6fa6-4fca-8380-c40c9e6e21a3.svg"/></figure>
  <br />
  <div id="toc_container">
  <b><p class="toc_title">Contents</p></b>
  <ul class="toc_list">
  <li><a href="#aboutblog">1 このブログについて</a></li>
  <li><a href="#wordcloud">2 WordCloud</a></li>
</ul>
</div>
  <h2 id="aboutblog">このブログについて</h2>
  <p>このブログは・・・</p>
  <img src="/assets/logo3.svg" alt="logo" title="logo">
  <p>ぼやきという言葉は常々マイナスに捉えられがちですが実はアイディアややる気の源泉だったりします。</p>
  <p>そんな源泉になるようなことを届けられるブログしていきます。</p>
  <h2 id="wordcloud">WordCloud</h2>
  <p>
    <a href="https://github.com/tubone24/auto_tweet_wordcloud/actions?query=workflow%3A%22Generate+Word+Cloud%22">
      GitHub Actions
    </a>と
    <a href="https://amueller.github.io/word_cloud/">WordCloud for Python</a>作ったWordCloud</p>
  <img src="https://raw.githubusercontent.com/tubone24/auto_tweet_wordcloud/master/word_cloud_blog_large.png" alt="wordcloud" title="wordcloud">
`;

class About extends Component {
  render() {
    return (
      <div className={style.post + " row order-2"}>
        <Header
          img="https://i.imgur.com/6B7WC7D.jpg"
          title="Who is tubone?"
          authorName="tubone"
          authorImage={true}
          subTitle="Why do I write this blog?"
        />
        <Sidebar />
        <main
          className={
            style.content + " col-xl-7 col-lg-6 col-md-12 col-sm-12 order-2"
          }
        >
          <Content post={html} />
        </main>

        <ShareBox url="https://blog.tubone-project24.xyz/about" />

        <SEO
          title="Who is tubone?"
          url="https://blog.tubone-project24.xyz/about"
          siteTitleAlt="tubone BOYAKI Profile"
          isPost
          description="About tubone Profile"
          tag="about"
          image="https://i.imgur.com/VUti8s3.png"
        />
      </div>
    );
  }
}

export default About;
