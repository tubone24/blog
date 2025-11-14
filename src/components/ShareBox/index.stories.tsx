import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-webpack5";

import ShareBox from "./index";

export default {
  title: "Components/ShareBox",
  component: ShareBox,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} as ComponentMeta<typeof ShareBox>;

const Template: ComponentStory<typeof ShareBox> = (args) => (
  <ShareBox {...args} />
);

export const Default = Template.bind({});
Default.args = {
  url: "test",
};
