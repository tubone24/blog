import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Header from "./index";

const meta = {
  title: "Components/Header",
  component: Header,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    img: "https://i.imgur.com/6B7WC7D.jpg",
    title: "テストテストテストテストテスト",
    subTitle: "2022/04/25",
    authorImage: true,
    authorName: "tubone",
  },
};
