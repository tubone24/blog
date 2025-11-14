import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-webpack5";

import NotFoundPage, { GetAllPageQuery } from "./404";

export default {
  title: "Pages/NotFoundPage",
  component: NotFoundPage,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} as ComponentMeta<typeof NotFoundPage>;

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

const Template: ComponentStory<typeof NotFoundPage> = (args) => (
  <NotFoundPage {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: getAllPageQuery.data,
};
