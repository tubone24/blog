import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Footer from "./index";

const meta = {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
