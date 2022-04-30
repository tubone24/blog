import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Footer from "./index";

export default {
  title: "Footer",
  component: Footer,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = () => <Footer />;

export const Default = Template.bind({});
