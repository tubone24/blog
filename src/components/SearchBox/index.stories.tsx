import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { within, userEvent, waitFor } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import SearchBox from "./index";

export default {
  title: "Components/SearchBox",
  component: SearchBox,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
    viewport: {
      defaultViewport: "tablet",
    },
  },
} as ComponentMeta<typeof SearchBox>;

const Template: ComponentStory<typeof SearchBox> = () => <SearchBox />;

export const EmptySearchBox = Template.bind({});

export const FilledSearchBox = Template.bind({});
FilledSearchBox.play = async ({ canvasElement }) => {
  // Starts querying the component from its root element
  const canvas = within(canvasElement);

  await userEvent.type(
    canvas.getByTestId("algolia-search-input"),
    "Renovateの作るPRでArtifact update problemが出た時の対処法",
    {
      delay: 100,
    }
  );
  await waitFor(() => {
    const items = canvas.getAllByRole("listbox");
    expect(items.length).toBe(1);
  });
};
