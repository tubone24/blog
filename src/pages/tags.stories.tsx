import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Tags from "./tags";

jest.mock("@/components/Sidebar", () => () => {
  return null;
});

export default {
  title: "Pages/tags",
  component: Tags,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} as ComponentMeta<typeof Tags>;

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

const Template: ComponentStory<typeof Tags> = (args) => <Tags {...args} />;

export const Default = Template.bind({});
Default.args = {
  data: pageQuery,
};
