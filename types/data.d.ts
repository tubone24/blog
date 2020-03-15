export type Frontmatter = {
    title: string;
    date: string;
    path: string;
    categories: string[];
    tags: string[];
    excerpt: string;
    single: boolean;
};

export type EdgeNode = {
    id: number;
    frontmatter: Frontmatter;
};

export type SiteData = {
    site: {
        siteMetadata: {
            title: string;
            blogTitle: string;
            subtitle: string;
            description: string;
            copyright: string;
            repositoryName: string;
            repositoryLink: string;
        };
    };
    allMarkdownRemark: {
        totalCount: number;
        edges: {
            node: EdgeNode;
        }[];
    };
    markdownRemark: {
        frontmatter: Frontmatter;
        html: string;
    };
};

export type PageContext = {
    categories: string[];
    tags: string[];
    prev: Frontmatter | null;
    next: Frontmatter | null;
    posts: EdgeNode[] | null;
    categoryName: string;
    tagName: string;
};

export type SidebarQuery = {
    totalCount: number
    latestPosts: number
}
