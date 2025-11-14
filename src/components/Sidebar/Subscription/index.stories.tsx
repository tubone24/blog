import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-webpack5";

import Subscription from "./index";

export default {
  title: "Components/Subscription",
  component: Subscription,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} as ComponentMeta<typeof Subscription>;

const Template: ComponentStory<typeof Subscription> = (args) => (
  <Subscription />
);

export const Default = Template.bind({});
