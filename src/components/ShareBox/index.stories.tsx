import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import ShareBox from "./index";

const meta = {
  title: "Components/ShareBox",
  component: ShareBox,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} satisfies Meta<typeof ShareBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: "test",
    hasCommentBox: true,
  },
};
