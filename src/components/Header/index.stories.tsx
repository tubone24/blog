import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Header from "./index";

export default {
  title: "Header",
  component: Header,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {
  img: "https://i.imgur.com/6B7WC7D.jpg",
  title: "テストテストテストテストテスト",
  subTitle: "2022/04/25",
  authorImage: true,
  authorName: "tubone",
};
