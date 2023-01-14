import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import WordCloud from "./index";

export default {
  title: "Components/WordCloud",
  component: WordCloud,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} as ComponentMeta<typeof WordCloud>;

const Template: ComponentStory<typeof WordCloud> = (args) => <WordCloud />;

export const Default = Template.bind({});
