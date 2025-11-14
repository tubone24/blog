import React from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { within, userEvent, waitFor, expect } from "@storybook/test";

import SearchBox from "./index";

const meta: Meta<typeof SearchBox> = {
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptySearchBox: Story = {
  render: () => <SearchBox />,
};

export const FilledSearchBox: Story = {
  render: () => <SearchBox />,
  play: async ({ canvasElement }) => {
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
      const items = canvas.getByRole("listbox");
      expect(items).toBeInTheDocument();
    });
  },
};
