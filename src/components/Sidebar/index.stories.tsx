import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Sidebar, StaticQueryAllPost, StaticQueryLatestPost } from "./index";

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {
    backgrounds: {
      default: "green",
      values: [{ name: "green", value: "#d5ffd7" }],
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const allPosts: StaticQueryAllPost[] = [
  {
    node: {
      frontmatter: {
        date: "2022-01-01",
        tags: ["test", "test2"],
      },
    },
  },
  {
    node: {
      frontmatter: {
        date: "2022-01-02",
        tags: ["test", "test2"],
      },
    },
  },
  {
    node: {
      frontmatter: {
        date: "2022-01-01",
        tags: ["test", "test2"],
      },
    },
  },
  {
    node: {
      frontmatter: {
        date: "2022-01-02",
        tags: ["test", "test2"],
      },
    },
  },
  {
    node: {
      frontmatter: {
        date: "2022-01-01",
        tags: ["test", "test2"],
      },
    },
  },
  {
    node: {
      frontmatter: {
        date: "2022-01-02",
        tags: ["test", "test2"],
      },
    },
  },
  {
    node: {
      frontmatter: {
        date: "2022-01-01",
        tags: ["test", "test2"],
      },
    },
  },
  {
    node: {
      frontmatter: {
        date: "2022-01-02",
        tags: ["test", "test2"],
      },
    },
  },
];

const latestPosts: StaticQueryLatestPost[] = [
  {
    node: {
      fields: {
        slug: "/",
      },
      frontmatter: {
        date: "2022-01-01",
        title: "testtest",
        url: "https://tubone-project24.xyz",
      },
    },
  },
  {
    node: {
      fields: {
        slug: "/",
      },
      frontmatter: {
        date: "2022-01-02",
        title: "testtest2",
        url: "https://tubone-project24.xyz",
      },
    },
  },
  {
    node: {
      fields: {
        slug: "/",
      },
      frontmatter: {
        date: "2022-01-01",
        title: "testtest",
        url: "https://tubone-project24.xyz",
      },
    },
  },
  {
    node: {
      fields: {
        slug: "/",
      },
      frontmatter: {
        date: "2022-01-02",
        title: "testtest2",
        url: "https://tubone-project24.xyz",
      },
    },
  },
  {
    node: {
      fields: {
        slug: "/",
      },
      frontmatter: {
        date: "2022-01-01",
        title: "testtest",
        url: "https://tubone-project24.xyz",
      },
    },
  },
  {
    node: {
      fields: {
        slug: "/",
      },
      frontmatter: {
        date: "2022-01-02",
        title: "testtest2",
        url: "https://tubone-project24.xyz",
      },
    },
  },
];

export const Default: Story = {
  args: {
    latestPosts: latestPosts,
    totalCount: 8,
    allPosts: allPosts,
  },
  render: (args) => (
    <div
      className="row homepage"
      style={{
        marginTop: 20,
      }}
    >
      <Sidebar {...args} />
      <div className="col-xl-6 col-lg-7 col-md-12 col-xs-12 order-2">aaa</div>
      <div className="col-xl-2 col-lg-1 order-3" />
    </div>
  ),
};
