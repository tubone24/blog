import React from 'react';
import { Repository } from 'react-github-info';
import Sidebar from '../components/Sidebar';
import SEO from '../components/SEO';
import Chart from '../components/Chart';

const options = {
  title: "Like languages",
};
const data = [
  ["Language", "Size"],
  ["Python", 12],
  ["JavaScript", 5.5],
];


export default () => (
  <div className="container">
    <div
      className="row"
      style={{
        margin: 30,
        backgroundImage: 'url("https://raw.githubusercontent.com/tubone24/blog/master/static/assets/bg.jpg")',
      }}
    >
      <Sidebar />
      <div
        className="col order-1 col-md-offset-3"
        style={{
          padding: 100,
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <Chart data={data} height={"100%"} width={"85%"} options={options} />
        <Repository username="tubone24" repos="blog" custom="green" mode="dark" />
        <Repository username="tubone24" repos="portfolio" custom="green" />
        <Repository username="tubone24" repos="ebook-homebrew-nuxt-with-typescript-client" custom="green" />
        <Repository username="tubone24" repos="ebook-homebrew-vue-typescript-client" custom="green" />
        <Repository username="tubone24" repos="ebook-homebrew-android-app" custom="green" />
        <Repository username="tubone24" repos="PronamaWatchFace-Kotlin" custom="green" />
        <Repository username="tubone24" repos="markdown-memo" custom="green" />
        <Repository username="tubone24" repos="CalcPi.jl" custom="green" />
        <Repository username="tubone24" repos="ebook-homebrew-nim-client" custom="green" />
        <Repository username="tubone24" repos="R-statistics-snipets" custom="green" />
        <Repository username="tubone24" repos="askfm-qa-crawler" custom="green" />
        <Repository username="tubone24" repos="web-screenshot-to-slack-gas" custom="green" />
        <Repository username="tubone24" repos="moodle-ami" custom="green" />
        <Repository username="tubone24" repos="ebook-homebrew-pdf-converter" custom="green" />
        <Repository username="tubone24" repos="mac-auto-setup" custom="green" />
        <Repository username="tubone24" repos="ebook-homebrew-rust-client" custom="green" />
        <Repository username="tubone24" repos="rr-weather-data-with-aws" custom="green" />
        <Repository username="tubone24" repos="ebook_homebrew" custom="green" />
      </div>
    </div>
    <SEO
      title="GitHub Repos"
      url="https://blog.tubone-project24.xyz/github/"
      siteTitleAlt="tubone BOYAKI"
      isPost={false}
      description="GitHub Repos list"
      image="https://i.imgur.com/M795H8A.jpg"
    />
  </div>
);
