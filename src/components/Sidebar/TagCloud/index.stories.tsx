import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

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

export default {
  title: "Components/TagCloud",
  component: TagCloud,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} as ComponentMeta<typeof TagCloud>;

const Template: ComponentStory<typeof TagCloud> = (args) => (
  <TagCloud {...args} />
);

export const Default = Template.bind({});
Default.args = {
  allPosts,
};
