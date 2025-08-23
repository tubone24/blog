import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import TimeToRead from "./index";

const meta = {
  title: "Components/TimeToRead",
  component: TimeToRead,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} satisfies Meta<typeof TimeToRead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    words: 3,
    minutes: 4,
  },
};
