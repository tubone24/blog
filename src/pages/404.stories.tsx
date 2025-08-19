import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import NotFoundPage, { GetAllPageQuery } from "./404";

const getAllPageQuery: GetAllPageQuery = {
  data: {
    allSitePage: {
      edges: [
        {
          node: { path: "aaa" },
        },
        {
          node: { path: "bbb" },
        },
        {
          node: { path: "ccc" },
        },
      ],
    },
  },
};

const meta = {
  title: "Pages/NotFoundPage",
  component: NotFoundPage,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} satisfies Meta<typeof NotFoundPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: getAllPageQuery.data,
  },
};
