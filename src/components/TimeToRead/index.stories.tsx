import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-webpack5";

import TimeToRead from "./index";

export default {
  title: "Components/TimeToRead",
  component: TimeToRead,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} as ComponentMeta<typeof TimeToRead>;

const Template: ComponentStory<typeof TimeToRead> = (args) => (
  <TimeToRead {...args} />
);

export const Default = Template.bind({});
Default.args = {
  words: 3,
  minutes: 4,
};
