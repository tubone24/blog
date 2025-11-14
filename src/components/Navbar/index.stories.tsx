import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-webpack5";

import Navbar from "./index";

export default {
  title: "Components/Navbar",
  component: Navbar,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} as ComponentMeta<typeof Navbar>;

const Template: ComponentStory<typeof Navbar> = () => <Navbar />;

export const Default = Template.bind({});
