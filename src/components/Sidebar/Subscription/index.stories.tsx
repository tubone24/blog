import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Subscription from "./index";

const meta = {
  title: "Components/Subscription",
  component: Subscription,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} satisfies Meta<typeof Subscription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
