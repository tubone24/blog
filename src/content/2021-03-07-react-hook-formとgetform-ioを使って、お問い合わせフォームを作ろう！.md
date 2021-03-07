---
slug: 2021/03/07/react-hook-form
title: React Hook FormとGetform.ioを使って、お問い合わせフォームを作ろう！
date: 2021-03-07T13:03:39.605Z
description: 最近人気のReact Hook FormをGetform.ioと組み合わせてお問い合わせフォームを作りましょう。
tags:
  - JavaScript
  - React
  - getform.io
headerImage: https://i.imgur.com/DsrFLOE.png
templateKey: blog-post
---
[React Hook Form](https://react-hook-form.com/jp/)が便利らしいと聞いたので使ってみることにしました。


## Table of Contents

```toc

```

## React Hook Form

皆さん、[React Hook Form](https://react-hook-form.com/jp/)を知ってますか？

最近トレンドに乗っかってきた、FormをReact Hooksで簡単に作ることのできる代物です。

![img](https://i.imgur.com/2dqEW7L.png)

特徴として、Hooksを使って簡単にFormが作れる、そして再レンダリングが最小限に抑えられているのでパフォーマンスも高い、らしいです。

## Getform.io

[Getform.io](https://getform.io/)はフォームのバックエンドを提供するすばらしいサービスです。

詳しくは[こちらの過去記事](https://blog.tubone-project24.xyz/2021/02/13/netlify-github-action#getformio)をご確認いただければと思います。

## React Hook Form + Getform.io

合体！

![img](https://i.imgur.com/FzX8di6.jpg)

だめ～となるかと思いましたがうまいことできました。

![img](https://i.imgur.com/yYJBK98.jpg)

今回はお問い合わせフォームを作っていきます。

## 実コード

```typescript
import React, {useState} from "react";
import { useForm } from "react-hook-form";
import Button from "./button";
type Inputs = {
  name: string,
  email: string,
  subject: string,
  message: string,
};

const ContactForm = () => {
  const [serverState, setServerState] = useState({ submitting: false, status: {ok: false, msg: ""} });
  const { register, handleSubmit, errors } = useForm<Inputs>();
  const handleServerResponse = (ok: boolean, msg: string) => {
    setServerState({ submitting: true, status: { ok, msg } });
  };
  const onSubmit = (data: Inputs, e: any) => {
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("subject", data.subject)
    formData.append("message", data.message)
    fetch('https://getform.io/f/897f187e-876d-42a7-b300-7c235af72e6d', {
      method: 'POST',
      body: formData
    })
      .then(() => {
        e.target.reset();
        handleServerResponse(true, "Submitted!");
      })
      .catch((error) => {
        alert(error)
        console.error(error)
        handleServerResponse(false, error.toString());
      });
  }

  return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <p>
    <label>Your Name<br/>
    <input
      name="name"
      placeholder="Enter your name"
      type="text"
      ref={register({ required: true })} />
    {errors.name && <span>This field is required</span>}
    </label>
    </p>
    <p>
    <label> Your email<br/>
    <input
      name="email"
      type="email"
      placeholder="Enter your email"
      ref={register({ pattern: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i, required: true })} />
    {errors.email && <span>This field is required and only email format</span>}
    </label>
    </p>
    <p>
    <label>
      Subject<br/>
    <input
      name="subject"
      type="text"
      maxLength={30}
      placeholder="Subject here..."
      ref={register({required: true })} />
      {errors.subject && <span>This field is required</span>}
    </label>
    </p>
    <p>
    <label>
      Message<br />
      <textarea
        name="message" placeholder="Something writing..." rows={6} cols={25} ref={register({required: true })}/>
        {errors.message && <span>This field is required</span>}
    </label>
    </p>
      <Button dark={serverState.submitting && serverState.status.ok} disabled={serverState.submitting && serverState.status.ok}>
        { serverState.submitting && serverState.status.ok ? serverState.status.msg: 'Submit'}
      </Button>
  </form>
);
}

export default ContactForm
```
