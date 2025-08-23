import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Navbar from "./index";

const meta = {
  title: "Components/Navbar",
  component: Navbar,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
