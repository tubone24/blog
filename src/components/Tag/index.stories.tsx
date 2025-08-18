import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-webpack5";

import Tag from "./index";

export default {
  title: "Components/Tag",
  component: Tag,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} as ComponentMeta<typeof Tag>;

const Template: ComponentStory<typeof Tag> = (args) => <Tag {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: "test",
  count: 4,
};
