import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Card from "./index";

export default {
  title: "Components/Card",
  component: Card,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
    viewport: {
      defaultViewport: "tablet",
    },
  },
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Storybookを使ってコンポーネントを管理しよう！",
  date: "2022-01-01",
  url: "#",
  headerImage: "https://i.imgur.com/6B7WC7D.jpg",
  description: "こんにちはこんにちはこんにちはこんにちは！！",
  tags: ["テスト", "Storybook"],
  index: 0,
};

export const NoTags = Template.bind({});
NoTags.args = {
  title: "Storybookを使ってコンポーネントを管理しよう！",
  date: "2022-01-01",
  url: "#",
  headerImage: "https://i.imgur.com/6B7WC7D.jpg",
  description: "こんにちはこんにちはこんにちはこんにちは！！",
  tags: [],
  index: 0,
};
