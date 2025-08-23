import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import TagCloud from "./index";

import { AllPost } from "@/components/Sidebar/entity";

const allPosts: AllPost[] = [
  {
    node: {
      frontmatter: {
        date: "2022-01-01",
        tags: ["test", "test", "test", "foo", "bar"],
      },
    },
  },
];

const meta = {
  title: "Components/TagCloud",
  component: TagCloud,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} satisfies Meta<typeof TagCloud>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    allPosts,
  },
};
