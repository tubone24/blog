import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  Title,
  Subtitle,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs";

import Card from "./index";

export default {
  title: "Components/Card",
  component: Card,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>
            <p>Component for displaying blog posts in card format</p>
          </Subtitle>
          <Description
            markdown={`## What is this component?
The Card Component is used to display the article summary and header in a card format on the index page of a blog.

In addition to the title, the article includes a description, the date the article was written, and tag information, which are also displayed clearly.

## Preview
![preview](./assets/storybook-card-prev.gif)
`}
          />
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
    viewport: {
      defaultViewport: "tablet",
    },
  },
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Storybookを使ってコンポーネントを管理しよう！",
  date: "2022-01-01",
  url: "#",
  headerImage: "https://i.imgur.com/6B7WC7D.jpg",
  description: "こんにちはこんにちはこんにちはこんにちは！！",
  tags: ["テスト", "Storybook"],
  index: 0,
};

export const NoTags = Template.bind({});
NoTags.args = {
  title: "Storybookを使ってコンポーネントを管理しよう！",
  date: "2022-01-01",
  url: "#",
  headerImage: "https://i.imgur.com/6B7WC7D.jpg",
  description: "こんにちはこんにちはこんにちはこんにちは！！",
  tags: [],
  index: 0,
};
