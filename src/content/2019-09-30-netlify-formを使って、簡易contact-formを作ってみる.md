---
slug: 2019/09/30/netlify-form
title: Netlify Formを使って、簡易Contact Formを作ってみる
date: 2019-09-30T03:47:34.524Z
description: Netlify Formを使って、簡易Contact Formを作ってみます。
tags:
  - JavaScript
  - Netlify
  - Netlify Form
  - Gatsby.js
  - React
  - Contact Form
headerImage: 'https://i.imgur.com/uWmwQRq.png'
templateKey: blog-post
---
かんたんにFormできた。

Netlifyに簡単にFormを作る機能が用意されているので利用用途ないですが、Gatsby.jsで作ったBlogにFormを作ってみようかと思います。

[https://www.netlify.com/docs/form-handling/](https://www.netlify.com/docs/form-handling/)

特に必要なわけではないので技術選定とかはしませんが、一般的にForm付きのページを作る際、

- PHPでゴリゴリ書く
- Google Formを使う

の選択肢があるかと思います。

せっかくGatsby.jsで静的サイトに仕上げてるのでPHPで書くのだけはやめたいです。

そんなときにNetlify FormやGoogle Formは役立つのかもしれませんね。

## Table of Contents

```toc

```

## Gatsby.jsでForm用ページを個別に作る

せっかくのReactなのでコンポーネントにしてもよいのですが、Formなんて1ページしか使わないので
再利用性を考えずページとして作っちゃいます。

Gatsby.jsではpagesに入れたJavaScriptは固定ページとして動作しますので、ここではcontact.jsという名前でFormページを作ります。（お問い合わせページですね）

公式Docを読むとFormタグを打つ際にattributeにdata-netlify=trueとするだけらしいですね。こりりゃ簡単。

早速作ってみます。

```javascript
import React from 'react';
import ReactGA from 'react-ga';


export default class Contact extends React.Component {

  render() {
    return (
      <div className="container">
        <div
          className="row"
          style={{
            margin: 15,
          }}
        >
          <Sidebar/>
          <div className="col order-2">
            <h1>Contact Form</h1>
            <p>Please your Comment.</p>
            <form
              name="contact"
              method="post"
              action="/thanks/"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
            >
              {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
              <input type="hidden" name="form-name" value="contact"/>
              <p hidden>
                <label>
                  Don’t fill this out:{' '}
                  <input name="bot-field" onChange={this.handleChange}/>
                </label>
              </p>
              <p>
                <label>
                  Your name:<br/>
                  <input type="text" name="name" class="form-control" maxLength="30" minLength="2" required placeholder="Enter your name"/>

                </label>
              </p>
              <p>
                <label>
                  Your email:<br/>
                  <input type="email" name="email" class="form-control" aria-describedby="emailHelp" pattern="^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$" required placeholder="Enter your email" />
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </label>
              </p>
              <p>
                <label>
                  Message:<br/>
                  <textarea name="message" class="form-control" placeholder="Something writing..."/>
                </label>
              </p>
              <p>
                <label>
                  File:<br />
                  <input type="file" name="attachment" class="btn btn-info" />
                </label>
              </p>
              <p>
                <button type="submit" class="btn btn-primary">Send</button>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
```

このような形でFormタグにattributeを追加するだけです。

どうやらNetlifyでビルド済みのHTMLをアップロードする際、タグを解析してからアップロードしてるらしい。

なので、ほかにもFormを使う際はname属性を変えて、別のFormということを示す必要があります。
　
もちろん、タグには通常のHTML同様、Bootstrapやラベル、patternを当てることもできますので、

```
<button type="submit" class="btn btn-primary">Send</button> <!-- btn classの設定 -->
```

のような形や、

```html
<label>Your email:<br/>
 <!-- ラベルを使ったり・・ -->
  <input type="email" name="email" class="form-control" aria-describedby="emailHelp" pattern="^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$" required placeholder="Enter your email" />
　<!-- patternやrequired, placeholderも設定可能 -->
  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
</label>
```

のような形で直感的なFormを作ることもできます。

## Bot除け

Netlify FormではいわゆるスパムBot除けとして2種類のオプションが用意されてます。

1. いわゆる人間だったらこのフォームに何も入れるなという隠れフォームを作る（data-netlify-honeypot）
2. reCaptureを設定する

今回はお手軽に実装したいため、1番で進めます。

### data-netlify-honeypot

data-netlify-honeypotの設定はFormのattributeに、data-netlify-honeypot=隠れフォームのnameを設定します。

```html
<form
  name="contact"
  method="post"
  action="/thanks/"
  data-netlify="true"
  data-netlify-honeypot="bot-field"
 >

<input type="hidden" name="form-name" value="contact"/>
<p hidden>
  <label>
    Don’t fill this out:{' '}
    <input name="bot-field" onChange={this.handleChange}/>
  </label>
</p>
```

そして実際に隠れフォームを設定します。

hiddenにしてるため、ふつう人間が入力することはないですが、念のため、フォームに何も入れるなというラベルを貼っておきます。

こうすることで、bot-fieldに何らかしら値が入ってた場合、Form内容がNetlifyに登録されないようになります。

## 内容の確認

内容の確認はNetlify=>Forms=>Activity Formsから簡単にできます。

![Img](https://i.imgur.com/uWmwQRq.png)

また、Formが送信されたときにメールor Slack or Webhookを流す機能もあります。

![Img](https://i.imgur.com/BnS7iSC.png)

これでお問い合わせを見逃すことがなくなりますね！

## 結論

以前、PHPで頑張ってFormを作ってましたが、最近はこんなに簡単にFormが作れるのかと感心しました。
