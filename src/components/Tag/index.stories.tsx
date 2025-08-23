import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Tag from "./index";

const meta = {
  title: "Components/Tag",
  component: Tag,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "test",
    count: 4,
  },
};
