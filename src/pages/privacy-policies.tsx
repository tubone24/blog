import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Content from "@/components/Content";
import ShareBox from "@/components/ShareBox";
import SEO from "@/components/SEO";
import * as style from "./privacy-policies.module.scss";

const html = `
  <h1>プライバシーポリシー</h1>
  <img src="https://i.imgur.com/FyHE8bb.png" alt="key" title="key">
  <h2>私たちについて</h2>
  <p>私たちのサイトアドレスは<b>https://blog.tubone-project24.xyz</b>です。</p>
  <h2>このサイトが収集する個人データと収集の理由</h2>
  <h3>コメント</h3>
  <p>当サイトのコメント機能には<a href="https://github.com/gitalk/gitalk">Gitalk</a>を使用してます。訪問者が
  このサイトにコメントを残す際、コメントフォームに表示されているデータはGitHubのユーザ情報とともに
  <a href="https://github.com/tubone24/blog/issues">本ブログのGitHub Issues</a>に管理されます。</p>
  <h3>他サイトからの埋め込みコンテンツ</h3>
  <p>このサイトの投稿には埋め込みコンテンツ (動画、画像、投稿など) が含まれます。
  他サイトからの埋め込みコンテンツは、訪問者がそのサイトを訪れた場合とまったく同じように振る舞います。</p>
  <p>これらのサイトは、あなたのデータの収集、Cookie の使用、サードパーティによる追加トラッキングの埋め込み、
  埋め込みコンテンツとのやりとりの監視を行うことがあります。
  アカウントを使ってそのサイトにログイン中の場合、埋め込みコンテンツとのやりとりのトラッキングも含まれます。</p>
  <h3>アナリティクス</h3>
  <p>このサイトではサービス向上のためGoogle, Inc.のGoogle Analyticsを利用して訪問者の分析を行っております。</p>
  <p>Cookie情報を利用し、IPアドレス等のユーザ様情報の一部が、Google, Inc.に収集される可能性があります。</p>
  <p>サイト利用状況の分析、セキュリティ、その他のサービスの提供目的に限りこれを使用します。
  利用者は、本サイトを利用することで、上記方法および目的においてGoogleが行うこうしたデータ処理につき許可を与えたものとみなします。
  ※なお、「Cookie」は、ユーザー側のブラウザ操作により拒否することも可能です。
  この規約に関して、詳しくは<a href="https://marketingplatform.google.com/about/analytics/terms/jp/">Google アナリティクス利用規約</a>を参照してください。</p>
  <h2>あなたのデータの送信先</h2>
  <p>訪問者によるコメントは、自動スパム検出サービスを通じて確認を行う場合があります。</p>
  <p>またコメントデータはGitHubにIssueの形で送信されます。</p>
  <h2>免責事項</h2>
  <p>当サイトで掲載している画像の著作権・肖像権等は各権利所有者に帰属致します。権利を侵害する目的ではございません。
  記事の内容や掲載画像等に問題がございましたら、
  各権利所有者様本人が<a href="https://portfolio.tubone-project24.xyz/#contact">コンタクトフォーム</a>からご連絡ください。確認後、対応させて頂きます。</p>
  <p>当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。</p>
  <p>当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。</p>
  <p>当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。</p>
`;

const PrivacyPolicies = () => (
  <div className={style.post + " row order-2"}>
    <Header
      img="https://i.imgur.com/FyHE8bb.png"
      title="プライバシーポリシー"
      authorName="tubone"
      authorImage={true}
      subTitle="20xx/xx/xx"
    />
    <Sidebar />
    <main
      className={
        style.content + " col-xl-7 col-lg-6 col-md-12 col-sm-12 order-2"
      }
    >
      <Content post={html} />
    </main>

    <ShareBox url="https://blog.tubone-project24.xyz/privacy-policies" />

    <SEO
      title="プライバシーポリシー"
      url="https://blog.tubone-project24.xyz/privacy-policies"
      siteTitleAlt="プライバシーポリシー"
      isPost
      description="プライバシーポリシー"
      tag="privacy policies"
      image="https://i.imgur.com/FyHE8bb.png"
    />
  </div>
);

export default PrivacyPolicies;
