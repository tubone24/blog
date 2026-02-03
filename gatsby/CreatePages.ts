import path from "path";
import { GatsbyNode } from "gatsby";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import createPaginatedPages from "gatsby-paginate";

const query = `
    {
      allMarkdownRemark(
        limit: 1000
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            id
            html
            fields {
              slug
            }
            frontmatter {
              tags
              templateKey
              slug
              id
              title
              url: slug
              date
              tags
              description
              headerImage
              useAi
              year: date(formatString: "YYYY")
              month: date(formatString: "MM")
            }
          }
        }
      }
    }
  `;

type Result = {
  allMarkdownRemark: {
    edges: Node[];
  };
};

type Node = {
  node: {
    id: string;
    frontmatter: {
      slug: string;
      tags: string[];
      templateKey: string;
      year: string;
      month: string;
      useAi?: boolean;
    };
    fields: {
      slug: string;
    };
    html: string;
  };
};

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions: { createPage },
}) => {
  const result = await graphql<Result>(query);
  if (result.errors) {
    throw result.errors;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { edges = [] } = result.data!.allMarkdownRemark;

  const tagSet = new Set();
  const years = new Set();
  const yearMonths = new Set();
  const periodTemplate = path.resolve("src/templates/period-summary.tsx");

  createPaginatedPages({
    edges,
    createPage,
    pageTemplate: "src/templates/index.tsx",
    context: {
      totalCount: edges.length,
    },
    pathPrefix: "pages",
    buildPath: (index: number, pathPrefix: string) => {
      if (index > 1) {
        return `${pathPrefix}/${index}`;
      }
      return "/";
    },
  });

  edges.forEach(({ node }: Node, index: number) => {
    const { id, frontmatter, fields, html } = node;
    const { slug, tags, templateKey, year, month, useAi } = frontmatter;

    // tag
    if (tags) {
      tags.forEach((item) => tagSet.add(item));
    }

    // slug
    let $path = fields.slug;
    if (slug) {
      $path = slug;
    }
    years.add(year);
    yearMonths.add(`${year}/${month}`);

    // replace img for lozad
    const repHtml = html.replace(
      /<img[\s|\S]src=/g,
      '<img class="lozad" src="data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7" data-src=',
    );

    // word count
    // Japanese can read about 400 characters per minute.
    // https://homepage-reborn.com/2015/06/10/%E4%BA%BA%E3%81%AF%EF%BC%91%E5%88%86%E9%96%93%E3%81%AB%E4%BD%95%E6%96%87%E5%AD%97%E8%AA%AD%E3%82%81%E3%82%8B%E3%81%AE%EF%BC%9F%E3%82%B9%E3%82%AD%E3%83%9E%E6%99%82%E9%96%93%E3%81%A7%E8%AA%AD%E3%81%BE/#:~:text=%E6%B8%AC%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%88%E3%81%86%EF%BC%81-,%E6%97%A5%E6%9C%AC%E4%BA%BA%E3%81%AE%EF%BC%91%E5%88%86%E9%96%93%E3%81%AB%E8%AA%AD%E3%82%81%E3%82%8B%E6%96%87%E5%AD%97%E6%95%B0%E3%81%AE%E5%B9%B3%E5%9D%87,400%E3%80%9C600%E5%AD%97%E3%81%A8%E3%81%97%E3%81%BE%E3%81%99%E3%80%82
    const words = repHtml
      .replace(/<code[\s, \S]*?<\/code>/g, "")
      .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
      .replace(/\s+/g, "")
      .replace(/#x.*;/, "")
      .replace(/&/, "").length;
    const minutes = Math.ceil(words / 400);

    const component = templateKey || "blog-post";
    createPage({
      path: $path,
      component: path.resolve(`src/templates/${String(component)}.tsx`),
      // additional data can be passed via context
      context: {
        id,
        index,
        repHtml,
        words,
        minutes,
        useAi: useAi || false,
      },
    });
  });

  // 年別ページ
  years.forEach((year) => {
    createPage({
      path: `/${year}/`,
      component: periodTemplate,
      context: {
        displayYear: year,
        periodStartDate: `${year}-01-01T00:00:00.000Z`,
        periodEndDate: `${year}-12-31T23:59:59.999Z`,
      },
    });
  });

  // 月別ページ
  yearMonths.forEach((yearMonth_) => {
    const yearMonth = yearMonth_ as string;
    const [year, month] = yearMonth.split("/");
    const startDate = `${year}-${month}-01T00:00:00.000Z`;
    const newStartDate = new Date(startDate);
    // 月末日を取得
    const endDate = new Date(
      new Date(newStartDate.setMonth(newStartDate.getMonth() + 1)).getTime() -
        1,
    ).toISOString();

    createPage({
      path: `/${year}/${month}/`,
      component: periodTemplate,
      context: {
        displayYear: year,
        displayMonth: month,
        periodStartDate: startDate,
        periodEndDate: endDate,
      },
    });
  });

  return tagSet.forEach((tag) => {
    createPage({
      path: `/tag/${tag}`,
      component: path.resolve("src/templates/tag.tsx"),
      context: {
        tag,
      },
    });
  });
};
