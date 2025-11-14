import React from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import Card from "./index";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
    docs: {
      description: {
        component: `## What is this component?
The Card Component is used to display the article summary and header in a card format on the index page of a blog.

In addition to the title, the article includes a description, the date the article was written, and tag information, which are also displayed clearly.

## Preview
![preview](./assets/storybook-card-prev.gif)`,
      },
    },
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Storybookを使ってコンポーネントを管理しよう！",
    date: "2022-01-01",
    url: "#",
    headerImage: "https://i.imgur.com/6B7WC7D.jpg",
    description: "こんにちはこんにちはこんにちはこんにちは！！",
    tags: ["テスト", "Storybook"],
    index: 0,
  },
};

export const NoTags: Story = {
  args: {
    title: "Storybookを使ってコンポーネントを管理しよう！",
    date: "2022-01-01",
    url: "#",
    headerImage: "https://i.imgur.com/6B7WC7D.jpg",
    description: "こんにちはこんにちはこんにちはこんにちは！！",
    tags: [],
    index: 0,
  },
};
