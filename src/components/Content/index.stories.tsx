import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-webpack5";

import Content from "./index";
// Code Highlighting
import "@/components/Layout/index.scss";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/command-line/prism-command-line.css";

const codeBlock = `<div class="gatsby-highlight has-highlighted-lines" data-language="javascript"><pre style="counter-reset: linenumber 4" class="language-javascript line-numbers"><code class="language-javascript"><span class="token comment">// In your gatsby-config.js\n</span>
<span class="gatsby-highlight-code-line"><span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>  <span class="token punctuation">{</span>
    <span class="token literal-property property">resolve</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">gatsby-transformer-remark</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span>
    <span class="token literal-property property">options</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">gatsby-remark-prismjs</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>`;

const codeBlockShell = `<div class="gatsby-highlight" data-language="shell"><pre class="language-shell"><code class="language-shell"><span class="command-line-prompt"><span data-user="alice" data-host="dev.localhost"></span></span><span class="token function">npm</span> run build</code></pre></div>`;

const listBlock = `<ul><li>1</li><li>2<ul><li>2-1</li><li>2-2<ul><li>2-2-1</li><li>2-2-2</li></ul></li></ul></li></ul>`;

const tableBlock = `<table><thead><tr><th>Head</th><th>Head</th><th>Head</th></tr></thead><tbody><tr><td>Text</td><td>Text</td><td>Text</td></tr><tr><td>Text</td><td>Text</td><td>Text</td></tr><tr><td>Text</td><td>Text</td><td>Text</td></tr><tr><td>Text</td><td>Text</td><td>Text</td></tr></tbody></table>`;

// https://www.aozora.gr.jp/cards/000148/card772.html
const sampleText =
  "<h2>見出し</h2>" +
  "<p>H2/H3/H4を基本的に利用する。</p>" +
  "<p>H1はブログヘッダーに適用されているため、content内で利用すると２重にH1を定義することになる。極力使わないこと。</p>" +
  "<h2>H2見出し</h2>" +
  "<h3>H3見出し</h3>" +
  "<h4>H4見出し</h4>" +
  "<h5>H5見出し</h5>" +
  "<h2>リスト</h2>" +
  "<p>個人的趣味により、olは使ってない</p>" +
  listBlock +
  "<h2>インライン要素</h2>" +
  "<p>この文章は途中で<em style='font-style: italic;'>イタリック(itaric)</em>になったり<strong>太文字(strong)</strong>になったり<del>打ち消し(delete)</del>たり忙しい文章です。</p>" +
  "<p>このように<a href='#'>リンク</a>を作ったり</p>" +
  "<blockquote><p>芸術は爆発だ！</p><cite>芸術は爆発だ! 岡本太郎痛快語録</cite></blockquote>" +
  "<p>引用を使ったり</p>" +
  codeBlock +
  "<p>コードブロックを使うこともできます。(コードブロックは<a href='https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/'>gatsby-remark-prismjs-title</a>で作ってます。)</p>" +
  codeBlockShell +
  "<p>コマンドラインを表現することもできます。</p>" +
  "<h2>テーブル</h2>" +
  tableBlock +
  "<h2>サンプル文章: 私の個人主義</h2>" +
  "<p>それは当時同時にわが＃「共について事のためからするなませ。最も生涯に楽ようもしきりにその約束ですませでもをよしがいるたがも通知売っただて、まだにも解らでませましです。背後が引き返しない訳はもし事実についたですで。とうとう岡田さんで希望家来そう意味に云っませ耳その家来あなたか発展をというご講演ですたずだろて、そうした生涯は私か肴世界中にありて、岡田さんの方に新聞のあれをよくご奨励としてあなた権力をご学習をもっように近頃小遠慮をできるですらしいて、もしはなはだ所有が取次いだからいなものをなりでない。それでただご傾向がしのはそう大変というたて、その個性にも向いたてに対して先生の困るて得るですない。</p>" +
  "<p>同じ後下働きの上この茫然はおれ上をきまっでかと木下さんでただすならまし、理由のほかでについて大留学ありなたので、世間の以上を学校で結果でもの人が先刻聴いばいるから、まだの生涯がなっばそのためがもし見つかりたますと見えるですのですから、憂ですたてどうお主義やりだ事ありたませ。</p>" +
  "<p>だから義務か立派か落第へやりまして、翌日上見識の教えてなりだろ中をお関係のたくさんを起しあるた。十月がもひとまず調っから担がなうたたて、とにかく現に起って学習もまだ大きくなのな。だからお講演からきてはいでのんから、道徳には、もう私かしながら作っせるないないするれですませと勤めから、図書館はするているでう。ぼんやりしかるにもともかく理科というかかるなければ、それをは今末ばかり私のお自覚は長く移ろいるないです。</p>" +
  "<p>私はもちろん留学の事にお学問は来からいるでしょですですなて、一一の大牢のまだ存じますという通用でて、またその主人の向背にいうせるて、私かへ私の空を蹂躙に亡びているですのなけれでしょと関係して試験説きしまいありあっ。故意にまた嘉納さんにつまり当然したのないたです。</p>" +
  "<p>槙さんはこう田舎にするで述べるたのましあるでし。（それでも学校が行っためありなですばありは伴っううと、）ぴたり教えだ原因に、dutyの会でも移れから知らという、元の腐敗も今日のためまで通じなっのに窮めないて答弁院出るてしまっですに対してお弟なけれのだ。これはのらくら自分をするですように怒りていただくたのませてしかしちょっと大森自分あるですだ。</p>" +
  "<p>しかしこれから三通りも時代がなっじゃ、ほかにいくら聞かたですとしと、ないたないてしかし不理解を買うませべき。道の場合から、どんなところに今からもたじゃ、場合上が必ず次第四一二円に思いまでの国家に、それか用いよまし汚辱にあっなたくさんはもうなりれものありて、どうしてももう少し腰で淋しいて、こういう事が用いのが高等なかっないできでた。または無論前一十一日の出れでもはしありとかいう非常なけれお話がして、後でその頃この時がさばくれなのない。しっくりに中腰から目下さいます十十口今に叱りて、何かしですながらいるんってのにそう使うです事ますと、至極しものに十分ないで、おそらく本国に得から教えているないです。</p>" +
  "<p>道がならとしが何かないのでしようにありばかり減っでだて、また仕方はよかっ事のして、私が基礎にただす来るから三カ所が一杯は一人はもう叱りと得るまでうのませ。</p>" +
  "<p>今日ですんか得通りに充たすから、その義務も立派ない高等ないとするうはずべきは思わならな、悪い性質のつどの考えです人ずみと気に入るがいただきうつもりますらしい。それで私は熱心ないと散らかすたらのですはない、公平たて直さましのんとしがそれの手の画がそんな用と記念探して来なけれます。学校をは主ずいくら変っばいるれるた場合と支に行ったり、取消を尊ぶとか、さて画がつけ加えと云っ材料が立つ一つ、横着ないば、やはりするてない人格が広めよたと読んて、権利に洗わて孔雀だけ国家までからし人間は云うだ。あるいは十分がはその知人の不愉快らを今に倒さあり時へ進んが無論比較受けてい今にし事だ。</p>" +
  "<p>だからこれはある時が云っ持っのた、使用の軍隊に帰着思いない仕方のもさたんでないは進んたです。もう私はこの大切だ火事に推しなりた、講演の申をすこぶる与えなかろで得るているますのない。もっともし二十一円であったが、内心には箸よりは何を学校のしだから殖やしですのと行きですた。あるいは絶対そう自分を食わせろて得るですまいと、任命にしかるに矛盾のようます。</p>" +
  "<p>どう大反抗より這入っようです品評もなるいなけれて、わがのにご諸君家を与えます。</p>";

export default {
  title: "Components/Content",
  component: Content,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} as ComponentMeta<typeof Content>;

const Template: ComponentStory<typeof Content> = (args) => (
  <div className="row post order-2">
    <header className="intro-header site-heading text-center col-xl-2 col-lg-3 col-xs-12 order-lg-1">
      test Side Bar
    </header>
    <div className="col-xl-7 col-lg-6 col-md-12 col-sm-12 order-2 content">
      <Content {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  post: sampleText,
};
