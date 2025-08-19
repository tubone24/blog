import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import WordCloud from "./index";

const meta = {
  title: "Components/WordCloud",
  component: WordCloud,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} satisfies Meta<typeof WordCloud>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
