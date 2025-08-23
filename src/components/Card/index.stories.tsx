import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Card from "./index";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
    docs: {
      description: {
        component: "Component for displaying blog posts in card format",
      },
    },
    viewport: {
      defaultViewport: "tablet",
    },
  },
} satisfies Meta<typeof Card>;

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
