import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Tags from "./tags";

jest.mock("@/components/Sidebar", () => () => {
  return null;
});

const pageQuery: GatsbyTypes.getAllTagsQuery = {
  allMarkdownRemark: {
    edges: [
      {
        node: {
          frontmatter: {
            tags: ["foo", "foo", "foo", "bar", "bar", "hoge", "huga", "日本語"],
          },
        },
      },
    ],
  },
};

const meta = {
  title: "Pages/tags",
  component: Tags,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} satisfies Meta<typeof Tags>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: pageQuery,
  },
};
