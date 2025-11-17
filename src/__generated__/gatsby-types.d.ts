/* eslint-disable */

declare namespace GatsbyTypes {
  type Maybe<T> = T | null;
  type InputMaybe<T> = T | null;
  type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
  type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
  };
  type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
  };
  /** All built-in and custom scalars, mapped to their actual values */
  type Scalars = {
    /** The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID. */
    ID: string;
    /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
    String: string;
    /** The `Boolean` scalar type represents `true` or `false`. */
    Boolean: boolean;
    /** The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
    Int: number;
    /** The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
    Float: number;
    /** A date string, such as 2007-12-03, compliant with the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
    Date: string;
    /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
    JSON: any;
  };

  type BooleanQueryOperatorInput = {
    readonly eq: InputMaybe<Scalars["Boolean"]>;
    readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["Boolean"]>>>;
    readonly ne: InputMaybe<Scalars["Boolean"]>;
    readonly nin: InputMaybe<ReadonlyArray<InputMaybe<Scalars["Boolean"]>>>;
  };

  type DateQueryOperatorInput = {
    readonly eq: InputMaybe<Scalars["Date"]>;
    readonly gt: InputMaybe<Scalars["Date"]>;
    readonly gte: InputMaybe<Scalars["Date"]>;
    readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["Date"]>>>;
    readonly lt: InputMaybe<Scalars["Date"]>;
    readonly lte: InputMaybe<Scalars["Date"]>;
    readonly ne: InputMaybe<Scalars["Date"]>;
    readonly nin: InputMaybe<ReadonlyArray<InputMaybe<Scalars["Date"]>>>;
  };

  type Directory = Node & {
    readonly absolutePath: Scalars["String"];
    readonly accessTime: Scalars["Date"];
    readonly atime: Scalars["Date"];
    readonly atimeMs: Scalars["Float"];
    readonly base: Scalars["String"];
    readonly birthTime: Scalars["Date"];
    /** @deprecated Use `birthTime` instead */
    readonly birthtime: Maybe<Scalars["Date"]>;
    /** @deprecated Use `birthTime` instead */
    readonly birthtimeMs: Maybe<Scalars["Float"]>;
    readonly changeTime: Scalars["Date"];
    readonly children: ReadonlyArray<Node>;
    readonly ctime: Scalars["Date"];
    readonly ctimeMs: Scalars["Float"];
    readonly dev: Scalars["Int"];
    readonly dir: Scalars["String"];
    readonly ext: Scalars["String"];
    readonly extension: Scalars["String"];
    readonly gid: Scalars["Int"];
    readonly id: Scalars["ID"];
    readonly ino: Scalars["Float"];
    readonly internal: Internal;
    readonly mode: Scalars["Int"];
    readonly modifiedTime: Scalars["Date"];
    readonly mtime: Scalars["Date"];
    readonly mtimeMs: Scalars["Float"];
    readonly name: Scalars["String"];
    readonly nlink: Scalars["Int"];
    readonly parent: Maybe<Node>;
    readonly prettySize: Scalars["String"];
    readonly rdev: Scalars["Int"];
    readonly relativeDirectory: Scalars["String"];
    readonly relativePath: Scalars["String"];
    readonly root: Scalars["String"];
    readonly size: Scalars["Int"];
    readonly sourceInstanceName: Scalars["String"];
    readonly uid: Scalars["Int"];
  };

  type Directory_accessTimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type Directory_atimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type Directory_birthTimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type Directory_changeTimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type Directory_ctimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type Directory_modifiedTimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type Directory_mtimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type DirectoryConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<DirectoryEdge>;
    readonly group: ReadonlyArray<DirectoryGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<Directory>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type DirectoryConnection_distinctArgs = {
    field: DirectoryFieldsEnum;
  };

  type DirectoryConnection_groupArgs = {
    field: DirectoryFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type DirectoryConnection_maxArgs = {
    field: DirectoryFieldsEnum;
  };

  type DirectoryConnection_minArgs = {
    field: DirectoryFieldsEnum;
  };

  type DirectoryConnection_sumArgs = {
    field: DirectoryFieldsEnum;
  };

  type DirectoryEdge = {
    readonly next: Maybe<Directory>;
    readonly node: Directory;
    readonly previous: Maybe<Directory>;
  };

  type DirectoryFieldsEnum =
    | "absolutePath"
    | "accessTime"
    | "atime"
    | "atimeMs"
    | "base"
    | "birthTime"
    | "birthtime"
    | "birthtimeMs"
    | "changeTime"
    | "children"
    | "children.children"
    | "children.children.children"
    | "children.children.children.children"
    | "children.children.children.id"
    | "children.children.id"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.contentFilePath"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.children.parent.children"
    | "children.children.parent.id"
    | "children.id"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.contentFilePath"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "children.parent.children"
    | "children.parent.children.children"
    | "children.parent.children.id"
    | "children.parent.id"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.contentFilePath"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.parent.parent.children"
    | "children.parent.parent.id"
    | "ctime"
    | "ctimeMs"
    | "dev"
    | "dir"
    | "ext"
    | "extension"
    | "gid"
    | "id"
    | "ino"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.contentFilePath"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"
    | "mode"
    | "modifiedTime"
    | "mtime"
    | "mtimeMs"
    | "name"
    | "nlink"
    | "parent.children"
    | "parent.children.children"
    | "parent.children.children.children"
    | "parent.children.children.id"
    | "parent.children.id"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.contentFilePath"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.children.parent.children"
    | "parent.children.parent.id"
    | "parent.id"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.contentFilePath"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "parent.parent.children"
    | "parent.parent.children.children"
    | "parent.parent.children.id"
    | "parent.parent.id"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.contentFilePath"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.parent.parent.children"
    | "parent.parent.parent.id"
    | "prettySize"
    | "rdev"
    | "relativeDirectory"
    | "relativePath"
    | "root"
    | "size"
    | "sourceInstanceName"
    | "uid";

  type DirectoryFilterInput = {
    readonly absolutePath: InputMaybe<StringQueryOperatorInput>;
    readonly accessTime: InputMaybe<DateQueryOperatorInput>;
    readonly atime: InputMaybe<DateQueryOperatorInput>;
    readonly atimeMs: InputMaybe<FloatQueryOperatorInput>;
    readonly base: InputMaybe<StringQueryOperatorInput>;
    readonly birthTime: InputMaybe<DateQueryOperatorInput>;
    readonly birthtime: InputMaybe<DateQueryOperatorInput>;
    readonly birthtimeMs: InputMaybe<FloatQueryOperatorInput>;
    readonly changeTime: InputMaybe<DateQueryOperatorInput>;
    readonly children: InputMaybe<NodeFilterListInput>;
    readonly ctime: InputMaybe<DateQueryOperatorInput>;
    readonly ctimeMs: InputMaybe<FloatQueryOperatorInput>;
    readonly dev: InputMaybe<IntQueryOperatorInput>;
    readonly dir: InputMaybe<StringQueryOperatorInput>;
    readonly ext: InputMaybe<StringQueryOperatorInput>;
    readonly extension: InputMaybe<StringQueryOperatorInput>;
    readonly gid: InputMaybe<IntQueryOperatorInput>;
    readonly id: InputMaybe<StringQueryOperatorInput>;
    readonly ino: InputMaybe<FloatQueryOperatorInput>;
    readonly internal: InputMaybe<InternalFilterInput>;
    readonly mode: InputMaybe<IntQueryOperatorInput>;
    readonly modifiedTime: InputMaybe<DateQueryOperatorInput>;
    readonly mtime: InputMaybe<DateQueryOperatorInput>;
    readonly mtimeMs: InputMaybe<FloatQueryOperatorInput>;
    readonly name: InputMaybe<StringQueryOperatorInput>;
    readonly nlink: InputMaybe<IntQueryOperatorInput>;
    readonly parent: InputMaybe<NodeFilterInput>;
    readonly prettySize: InputMaybe<StringQueryOperatorInput>;
    readonly rdev: InputMaybe<IntQueryOperatorInput>;
    readonly relativeDirectory: InputMaybe<StringQueryOperatorInput>;
    readonly relativePath: InputMaybe<StringQueryOperatorInput>;
    readonly root: InputMaybe<StringQueryOperatorInput>;
    readonly size: InputMaybe<IntQueryOperatorInput>;
    readonly sourceInstanceName: InputMaybe<StringQueryOperatorInput>;
    readonly uid: InputMaybe<IntQueryOperatorInput>;
  };

  type DirectoryGroupConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<DirectoryEdge>;
    readonly field: Scalars["String"];
    readonly fieldValue: Maybe<Scalars["String"]>;
    readonly group: ReadonlyArray<DirectoryGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<Directory>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type DirectoryGroupConnection_distinctArgs = {
    field: DirectoryFieldsEnum;
  };

  type DirectoryGroupConnection_groupArgs = {
    field: DirectoryFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type DirectoryGroupConnection_maxArgs = {
    field: DirectoryFieldsEnum;
  };

  type DirectoryGroupConnection_minArgs = {
    field: DirectoryFieldsEnum;
  };

  type DirectoryGroupConnection_sumArgs = {
    field: DirectoryFieldsEnum;
  };

  type DirectorySortInput = {
    readonly fields: InputMaybe<ReadonlyArray<InputMaybe<DirectoryFieldsEnum>>>;
    readonly order: InputMaybe<ReadonlyArray<InputMaybe<SortOrderEnum>>>;
  };

  type File = Node & {
    readonly absolutePath: Scalars["String"];
    readonly accessTime: Scalars["Date"];
    readonly atime: Scalars["Date"];
    readonly atimeMs: Scalars["Float"];
    readonly base: Scalars["String"];
    readonly birthTime: Scalars["Date"];
    /** @deprecated Use `birthTime` instead */
    readonly birthtime: Maybe<Scalars["Date"]>;
    /** @deprecated Use `birthTime` instead */
    readonly birthtimeMs: Maybe<Scalars["Float"]>;
    readonly blksize: Maybe<Scalars["Int"]>;
    readonly blocks: Maybe<Scalars["Int"]>;
    readonly changeTime: Scalars["Date"];
    /** Returns the first child node of type MarkdownRemark or null if there are no children of given type on this node */
    readonly childMarkdownRemark: Maybe<MarkdownRemark>;
    readonly children: ReadonlyArray<Node>;
    /** Returns all children nodes filtered by type MarkdownRemark */
    readonly childrenMarkdownRemark: Maybe<
      ReadonlyArray<Maybe<MarkdownRemark>>
    >;
    readonly ctime: Scalars["Date"];
    readonly ctimeMs: Scalars["Float"];
    readonly dev: Scalars["Int"];
    readonly dir: Scalars["String"];
    readonly ext: Scalars["String"];
    readonly extension: Scalars["String"];
    readonly gid: Scalars["Int"];
    readonly id: Scalars["ID"];
    readonly ino: Scalars["Float"];
    readonly internal: Internal;
    readonly mode: Scalars["Int"];
    readonly modifiedTime: Scalars["Date"];
    readonly mtime: Scalars["Date"];
    readonly mtimeMs: Scalars["Float"];
    readonly name: Scalars["String"];
    readonly nlink: Scalars["Int"];
    readonly parent: Maybe<Node>;
    readonly prettySize: Scalars["String"];
    /** Copy file to static directory and return public url to it */
    readonly publicURL: Maybe<Scalars["String"]>;
    readonly rdev: Scalars["Int"];
    readonly relativeDirectory: Scalars["String"];
    readonly relativePath: Scalars["String"];
    readonly root: Scalars["String"];
    readonly size: Scalars["Int"];
    readonly sourceInstanceName: Scalars["String"];
    readonly uid: Scalars["Int"];
  };

  type File_accessTimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type File_atimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type File_birthTimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type File_changeTimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type File_ctimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type File_modifiedTimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type File_mtimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type FileConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<FileEdge>;
    readonly group: ReadonlyArray<FileGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<File>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type FileConnection_distinctArgs = {
    field: FileFieldsEnum;
  };

  type FileConnection_groupArgs = {
    field: FileFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type FileConnection_maxArgs = {
    field: FileFieldsEnum;
  };

  type FileConnection_minArgs = {
    field: FileFieldsEnum;
  };

  type FileConnection_sumArgs = {
    field: FileFieldsEnum;
  };

  type FileEdge = {
    readonly next: Maybe<File>;
    readonly node: File;
    readonly previous: Maybe<File>;
  };

  type FileFieldsEnum =
    | "absolutePath"
    | "accessTime"
    | "atime"
    | "atimeMs"
    | "base"
    | "birthTime"
    | "birthtime"
    | "birthtimeMs"
    | "blksize"
    | "blocks"
    | "changeTime"
    | "childMarkdownRemark.children"
    | "childMarkdownRemark.children.children"
    | "childMarkdownRemark.children.children.children"
    | "childMarkdownRemark.children.children.id"
    | "childMarkdownRemark.children.id"
    | "childMarkdownRemark.children.internal.content"
    | "childMarkdownRemark.children.internal.contentDigest"
    | "childMarkdownRemark.children.internal.contentFilePath"
    | "childMarkdownRemark.children.internal.description"
    | "childMarkdownRemark.children.internal.fieldOwners"
    | "childMarkdownRemark.children.internal.ignoreType"
    | "childMarkdownRemark.children.internal.mediaType"
    | "childMarkdownRemark.children.internal.owner"
    | "childMarkdownRemark.children.internal.type"
    | "childMarkdownRemark.children.parent.children"
    | "childMarkdownRemark.children.parent.id"
    | "childMarkdownRemark.excerpt"
    | "childMarkdownRemark.excerptAst"
    | "childMarkdownRemark.fields.slug"
    | "childMarkdownRemark.fileAbsolutePath"
    | "childMarkdownRemark.frontmatter.date"
    | "childMarkdownRemark.frontmatter.description"
    | "childMarkdownRemark.frontmatter.headerImage"
    | "childMarkdownRemark.frontmatter.id"
    | "childMarkdownRemark.frontmatter.slug"
    | "childMarkdownRemark.frontmatter.tags"
    | "childMarkdownRemark.frontmatter.templateKey"
    | "childMarkdownRemark.frontmatter.title"
    | "childMarkdownRemark.headings"
    | "childMarkdownRemark.headings.depth"
    | "childMarkdownRemark.headings.id"
    | "childMarkdownRemark.headings.value"
    | "childMarkdownRemark.html"
    | "childMarkdownRemark.htmlAst"
    | "childMarkdownRemark.id"
    | "childMarkdownRemark.internal.content"
    | "childMarkdownRemark.internal.contentDigest"
    | "childMarkdownRemark.internal.contentFilePath"
    | "childMarkdownRemark.internal.description"
    | "childMarkdownRemark.internal.fieldOwners"
    | "childMarkdownRemark.internal.ignoreType"
    | "childMarkdownRemark.internal.mediaType"
    | "childMarkdownRemark.internal.owner"
    | "childMarkdownRemark.internal.type"
    | "childMarkdownRemark.parent.children"
    | "childMarkdownRemark.parent.children.children"
    | "childMarkdownRemark.parent.children.id"
    | "childMarkdownRemark.parent.id"
    | "childMarkdownRemark.parent.internal.content"
    | "childMarkdownRemark.parent.internal.contentDigest"
    | "childMarkdownRemark.parent.internal.contentFilePath"
    | "childMarkdownRemark.parent.internal.description"
    | "childMarkdownRemark.parent.internal.fieldOwners"
    | "childMarkdownRemark.parent.internal.ignoreType"
    | "childMarkdownRemark.parent.internal.mediaType"
    | "childMarkdownRemark.parent.internal.owner"
    | "childMarkdownRemark.parent.internal.type"
    | "childMarkdownRemark.parent.parent.children"
    | "childMarkdownRemark.parent.parent.id"
    | "childMarkdownRemark.rawMarkdownBody"
    | "childMarkdownRemark.tableOfContents"
    | "childMarkdownRemark.timeToRead"
    | "childMarkdownRemark.wordCount.paragraphs"
    | "childMarkdownRemark.wordCount.sentences"
    | "childMarkdownRemark.wordCount.words"
    | "children"
    | "childrenMarkdownRemark"
    | "childrenMarkdownRemark.children"
    | "childrenMarkdownRemark.children.children"
    | "childrenMarkdownRemark.children.children.children"
    | "childrenMarkdownRemark.children.children.id"
    | "childrenMarkdownRemark.children.id"
    | "childrenMarkdownRemark.children.internal.content"
    | "childrenMarkdownRemark.children.internal.contentDigest"
    | "childrenMarkdownRemark.children.internal.contentFilePath"
    | "childrenMarkdownRemark.children.internal.description"
    | "childrenMarkdownRemark.children.internal.fieldOwners"
    | "childrenMarkdownRemark.children.internal.ignoreType"
    | "childrenMarkdownRemark.children.internal.mediaType"
    | "childrenMarkdownRemark.children.internal.owner"
    | "childrenMarkdownRemark.children.internal.type"
    | "childrenMarkdownRemark.children.parent.children"
    | "childrenMarkdownRemark.children.parent.id"
    | "childrenMarkdownRemark.excerpt"
    | "childrenMarkdownRemark.excerptAst"
    | "childrenMarkdownRemark.fields.slug"
    | "childrenMarkdownRemark.fileAbsolutePath"
    | "childrenMarkdownRemark.frontmatter.date"
    | "childrenMarkdownRemark.frontmatter.description"
    | "childrenMarkdownRemark.frontmatter.headerImage"
    | "childrenMarkdownRemark.frontmatter.id"
    | "childrenMarkdownRemark.frontmatter.slug"
    | "childrenMarkdownRemark.frontmatter.tags"
    | "childrenMarkdownRemark.frontmatter.templateKey"
    | "childrenMarkdownRemark.frontmatter.title"
    | "childrenMarkdownRemark.headings"
    | "childrenMarkdownRemark.headings.depth"
    | "childrenMarkdownRemark.headings.id"
    | "childrenMarkdownRemark.headings.value"
    | "childrenMarkdownRemark.html"
    | "childrenMarkdownRemark.htmlAst"
    | "childrenMarkdownRemark.id"
    | "childrenMarkdownRemark.internal.content"
    | "childrenMarkdownRemark.internal.contentDigest"
    | "childrenMarkdownRemark.internal.contentFilePath"
    | "childrenMarkdownRemark.internal.description"
    | "childrenMarkdownRemark.internal.fieldOwners"
    | "childrenMarkdownRemark.internal.ignoreType"
    | "childrenMarkdownRemark.internal.mediaType"
    | "childrenMarkdownRemark.internal.owner"
    | "childrenMarkdownRemark.internal.type"
    | "childrenMarkdownRemark.parent.children"
    | "childrenMarkdownRemark.parent.children.children"
    | "childrenMarkdownRemark.parent.children.id"
    | "childrenMarkdownRemark.parent.id"
    | "childrenMarkdownRemark.parent.internal.content"
    | "childrenMarkdownRemark.parent.internal.contentDigest"
    | "childrenMarkdownRemark.parent.internal.contentFilePath"
    | "childrenMarkdownRemark.parent.internal.description"
    | "childrenMarkdownRemark.parent.internal.fieldOwners"
    | "childrenMarkdownRemark.parent.internal.ignoreType"
    | "childrenMarkdownRemark.parent.internal.mediaType"
    | "childrenMarkdownRemark.parent.internal.owner"
    | "childrenMarkdownRemark.parent.internal.type"
    | "childrenMarkdownRemark.parent.parent.children"
    | "childrenMarkdownRemark.parent.parent.id"
    | "childrenMarkdownRemark.rawMarkdownBody"
    | "childrenMarkdownRemark.tableOfContents"
    | "childrenMarkdownRemark.timeToRead"
    | "childrenMarkdownRemark.wordCount.paragraphs"
    | "childrenMarkdownRemark.wordCount.sentences"
    | "childrenMarkdownRemark.wordCount.words"
    | "children.children"
    | "children.children.children"
    | "children.children.children.children"
    | "children.children.children.id"
    | "children.children.id"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.contentFilePath"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.children.parent.children"
    | "children.children.parent.id"
    | "children.id"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.contentFilePath"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "children.parent.children"
    | "children.parent.children.children"
    | "children.parent.children.id"
    | "children.parent.id"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.contentFilePath"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.parent.parent.children"
    | "children.parent.parent.id"
    | "ctime"
    | "ctimeMs"
    | "dev"
    | "dir"
    | "ext"
    | "extension"
    | "gid"
    | "id"
    | "ino"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.contentFilePath"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"
    | "mode"
    | "modifiedTime"
    | "mtime"
    | "mtimeMs"
    | "name"
    | "nlink"
    | "parent.children"
    | "parent.children.children"
    | "parent.children.children.children"
    | "parent.children.children.id"
    | "parent.children.id"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.contentFilePath"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.children.parent.children"
    | "parent.children.parent.id"
    | "parent.id"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.contentFilePath"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "parent.parent.children"
    | "parent.parent.children.children"
    | "parent.parent.children.id"
    | "parent.parent.id"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.contentFilePath"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.parent.parent.children"
    | "parent.parent.parent.id"
    | "prettySize"
    | "publicURL"
    | "rdev"
    | "relativeDirectory"
    | "relativePath"
    | "root"
    | "size"
    | "sourceInstanceName"
    | "uid";

  type FileFilterInput = {
    readonly absolutePath: InputMaybe<StringQueryOperatorInput>;
    readonly accessTime: InputMaybe<DateQueryOperatorInput>;
    readonly atime: InputMaybe<DateQueryOperatorInput>;
    readonly atimeMs: InputMaybe<FloatQueryOperatorInput>;
    readonly base: InputMaybe<StringQueryOperatorInput>;
    readonly birthTime: InputMaybe<DateQueryOperatorInput>;
    readonly birthtime: InputMaybe<DateQueryOperatorInput>;
    readonly birthtimeMs: InputMaybe<FloatQueryOperatorInput>;
    readonly blksize: InputMaybe<IntQueryOperatorInput>;
    readonly blocks: InputMaybe<IntQueryOperatorInput>;
    readonly changeTime: InputMaybe<DateQueryOperatorInput>;
    readonly childMarkdownRemark: InputMaybe<MarkdownRemarkFilterInput>;
    readonly children: InputMaybe<NodeFilterListInput>;
    readonly childrenMarkdownRemark: InputMaybe<MarkdownRemarkFilterListInput>;
    readonly ctime: InputMaybe<DateQueryOperatorInput>;
    readonly ctimeMs: InputMaybe<FloatQueryOperatorInput>;
    readonly dev: InputMaybe<IntQueryOperatorInput>;
    readonly dir: InputMaybe<StringQueryOperatorInput>;
    readonly ext: InputMaybe<StringQueryOperatorInput>;
    readonly extension: InputMaybe<StringQueryOperatorInput>;
    readonly gid: InputMaybe<IntQueryOperatorInput>;
    readonly id: InputMaybe<StringQueryOperatorInput>;
    readonly ino: InputMaybe<FloatQueryOperatorInput>;
    readonly internal: InputMaybe<InternalFilterInput>;
    readonly mode: InputMaybe<IntQueryOperatorInput>;
    readonly modifiedTime: InputMaybe<DateQueryOperatorInput>;
    readonly mtime: InputMaybe<DateQueryOperatorInput>;
    readonly mtimeMs: InputMaybe<FloatQueryOperatorInput>;
    readonly name: InputMaybe<StringQueryOperatorInput>;
    readonly nlink: InputMaybe<IntQueryOperatorInput>;
    readonly parent: InputMaybe<NodeFilterInput>;
    readonly prettySize: InputMaybe<StringQueryOperatorInput>;
    readonly publicURL: InputMaybe<StringQueryOperatorInput>;
    readonly rdev: InputMaybe<IntQueryOperatorInput>;
    readonly relativeDirectory: InputMaybe<StringQueryOperatorInput>;
    readonly relativePath: InputMaybe<StringQueryOperatorInput>;
    readonly root: InputMaybe<StringQueryOperatorInput>;
    readonly size: InputMaybe<IntQueryOperatorInput>;
    readonly sourceInstanceName: InputMaybe<StringQueryOperatorInput>;
    readonly uid: InputMaybe<IntQueryOperatorInput>;
  };

  type FileGroupConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<FileEdge>;
    readonly field: Scalars["String"];
    readonly fieldValue: Maybe<Scalars["String"]>;
    readonly group: ReadonlyArray<FileGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<File>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type FileGroupConnection_distinctArgs = {
    field: FileFieldsEnum;
  };

  type FileGroupConnection_groupArgs = {
    field: FileFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type FileGroupConnection_maxArgs = {
    field: FileFieldsEnum;
  };

  type FileGroupConnection_minArgs = {
    field: FileFieldsEnum;
  };

  type FileGroupConnection_sumArgs = {
    field: FileFieldsEnum;
  };

  type FileSortInput = {
    readonly fields: InputMaybe<ReadonlyArray<InputMaybe<FileFieldsEnum>>>;
    readonly order: InputMaybe<ReadonlyArray<InputMaybe<SortOrderEnum>>>;
  };

  type FloatQueryOperatorInput = {
    readonly eq: InputMaybe<Scalars["Float"]>;
    readonly gt: InputMaybe<Scalars["Float"]>;
    readonly gte: InputMaybe<Scalars["Float"]>;
    readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["Float"]>>>;
    readonly lt: InputMaybe<Scalars["Float"]>;
    readonly lte: InputMaybe<Scalars["Float"]>;
    readonly ne: InputMaybe<Scalars["Float"]>;
    readonly nin: InputMaybe<ReadonlyArray<InputMaybe<Scalars["Float"]>>>;
  };

  type IntQueryOperatorInput = {
    readonly eq: InputMaybe<Scalars["Int"]>;
    readonly gt: InputMaybe<Scalars["Int"]>;
    readonly gte: InputMaybe<Scalars["Int"]>;
    readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["Int"]>>>;
    readonly lt: InputMaybe<Scalars["Int"]>;
    readonly lte: InputMaybe<Scalars["Int"]>;
    readonly ne: InputMaybe<Scalars["Int"]>;
    readonly nin: InputMaybe<ReadonlyArray<InputMaybe<Scalars["Int"]>>>;
  };

  type Internal = {
    readonly content: Maybe<Scalars["String"]>;
    readonly contentDigest: Scalars["String"];
    readonly contentFilePath: Maybe<Scalars["String"]>;
    readonly description: Maybe<Scalars["String"]>;
    readonly fieldOwners: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>;
    readonly ignoreType: Maybe<Scalars["Boolean"]>;
    readonly mediaType: Maybe<Scalars["String"]>;
    readonly owner: Scalars["String"];
    readonly type: Scalars["String"];
  };

  type InternalFilterInput = {
    readonly content: InputMaybe<StringQueryOperatorInput>;
    readonly contentDigest: InputMaybe<StringQueryOperatorInput>;
    readonly contentFilePath: InputMaybe<StringQueryOperatorInput>;
    readonly description: InputMaybe<StringQueryOperatorInput>;
    readonly fieldOwners: InputMaybe<StringQueryOperatorInput>;
    readonly ignoreType: InputMaybe<BooleanQueryOperatorInput>;
    readonly mediaType: InputMaybe<StringQueryOperatorInput>;
    readonly owner: InputMaybe<StringQueryOperatorInput>;
    readonly type: InputMaybe<StringQueryOperatorInput>;
  };

  type JSONQueryOperatorInput = {
    readonly eq: InputMaybe<Scalars["JSON"]>;
    readonly glob: InputMaybe<Scalars["JSON"]>;
    readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["JSON"]>>>;
    readonly ne: InputMaybe<Scalars["JSON"]>;
    readonly nin: InputMaybe<ReadonlyArray<InputMaybe<Scalars["JSON"]>>>;
    readonly regex: InputMaybe<Scalars["JSON"]>;
  };

  type MarkdownExcerptFormats = "HTML" | "MARKDOWN" | "PLAIN";

  type MarkdownHeading = {
    readonly depth: Maybe<Scalars["Int"]>;
    readonly id: Maybe<Scalars["String"]>;
    readonly value: Maybe<Scalars["String"]>;
  };

  type MarkdownHeadingFilterInput = {
    readonly depth: InputMaybe<IntQueryOperatorInput>;
    readonly id: InputMaybe<StringQueryOperatorInput>;
    readonly value: InputMaybe<StringQueryOperatorInput>;
  };

  type MarkdownHeadingFilterListInput = {
    readonly elemMatch: InputMaybe<MarkdownHeadingFilterInput>;
  };

  type MarkdownHeadingLevels = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  type MarkdownRemark = Node & {
    readonly children: ReadonlyArray<Node>;
    readonly excerpt: Maybe<Scalars["String"]>;
    readonly excerptAst: Maybe<Scalars["JSON"]>;
    readonly fields: Maybe<MarkdownRemarkFields>;
    readonly fileAbsolutePath: Maybe<Scalars["String"]>;
    readonly frontmatter: Maybe<MarkdownRemarkFrontmatter>;
    readonly headings: Maybe<ReadonlyArray<Maybe<MarkdownHeading>>>;
    readonly html: Maybe<Scalars["String"]>;
    readonly htmlAst: Maybe<Scalars["JSON"]>;
    readonly id: Scalars["ID"];
    readonly internal: Internal;
    readonly parent: Maybe<Node>;
    readonly rawMarkdownBody: Maybe<Scalars["String"]>;
    readonly tableOfContents: Maybe<Scalars["String"]>;
    readonly timeToRead: Maybe<Scalars["Int"]>;
    readonly wordCount: Maybe<MarkdownWordCount>;
  };

  type MarkdownRemark_excerptArgs = {
    format?: InputMaybe<MarkdownExcerptFormats>;
    pruneLength?: InputMaybe<Scalars["Int"]>;
    truncate?: InputMaybe<Scalars["Boolean"]>;
  };

  type MarkdownRemark_excerptAstArgs = {
    pruneLength?: InputMaybe<Scalars["Int"]>;
    truncate?: InputMaybe<Scalars["Boolean"]>;
  };

  type MarkdownRemark_headingsArgs = {
    depth: InputMaybe<MarkdownHeadingLevels>;
  };

  type MarkdownRemark_tableOfContentsArgs = {
    absolute?: InputMaybe<Scalars["Boolean"]>;
    heading: InputMaybe<Scalars["String"]>;
    maxDepth: InputMaybe<Scalars["Int"]>;
    pathToSlugField?: InputMaybe<Scalars["String"]>;
  };

  type MarkdownRemarkConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<MarkdownRemarkEdge>;
    readonly group: ReadonlyArray<MarkdownRemarkGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<MarkdownRemark>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type MarkdownRemarkConnection_distinctArgs = {
    field: MarkdownRemarkFieldsEnum;
  };

  type MarkdownRemarkConnection_groupArgs = {
    field: MarkdownRemarkFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type MarkdownRemarkConnection_maxArgs = {
    field: MarkdownRemarkFieldsEnum;
  };

  type MarkdownRemarkConnection_minArgs = {
    field: MarkdownRemarkFieldsEnum;
  };

  type MarkdownRemarkConnection_sumArgs = {
    field: MarkdownRemarkFieldsEnum;
  };

  type MarkdownRemarkEdge = {
    readonly next: Maybe<MarkdownRemark>;
    readonly node: MarkdownRemark;
    readonly previous: Maybe<MarkdownRemark>;
  };

  type MarkdownRemarkFields = {
    readonly slug: Maybe<Scalars["String"]>;
  };

  type MarkdownRemarkFieldsEnum =
    | "children"
    | "children.children"
    | "children.children.children"
    | "children.children.children.children"
    | "children.children.children.id"
    | "children.children.id"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.contentFilePath"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.children.parent.children"
    | "children.children.parent.id"
    | "children.id"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.contentFilePath"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "children.parent.children"
    | "children.parent.children.children"
    | "children.parent.children.id"
    | "children.parent.id"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.contentFilePath"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.parent.parent.children"
    | "children.parent.parent.id"
    | "excerpt"
    | "excerptAst"
    | "fields.slug"
    | "fileAbsolutePath"
    | "frontmatter.date"
    | "frontmatter.description"
    | "frontmatter.headerImage"
    | "frontmatter.id"
    | "frontmatter.slug"
    | "frontmatter.tags"
    | "frontmatter.templateKey"
    | "frontmatter.title"
    | "headings"
    | "headings.depth"
    | "headings.id"
    | "headings.value"
    | "html"
    | "htmlAst"
    | "id"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.contentFilePath"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"
    | "parent.children"
    | "parent.children.children"
    | "parent.children.children.children"
    | "parent.children.children.id"
    | "parent.children.id"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.contentFilePath"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.children.parent.children"
    | "parent.children.parent.id"
    | "parent.id"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.contentFilePath"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "parent.parent.children"
    | "parent.parent.children.children"
    | "parent.parent.children.id"
    | "parent.parent.id"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.contentFilePath"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.parent.parent.children"
    | "parent.parent.parent.id"
    | "rawMarkdownBody"
    | "tableOfContents"
    | "timeToRead"
    | "wordCount.paragraphs"
    | "wordCount.sentences"
    | "wordCount.words";

  type MarkdownRemarkFieldsFilterInput = {
    readonly slug: InputMaybe<StringQueryOperatorInput>;
  };

  type MarkdownRemarkFilterInput = {
    readonly children: InputMaybe<NodeFilterListInput>;
    readonly excerpt: InputMaybe<StringQueryOperatorInput>;
    readonly excerptAst: InputMaybe<JSONQueryOperatorInput>;
    readonly fields: InputMaybe<MarkdownRemarkFieldsFilterInput>;
    readonly fileAbsolutePath: InputMaybe<StringQueryOperatorInput>;
    readonly frontmatter: InputMaybe<MarkdownRemarkFrontmatterFilterInput>;
    readonly headings: InputMaybe<MarkdownHeadingFilterListInput>;
    readonly html: InputMaybe<StringQueryOperatorInput>;
    readonly htmlAst: InputMaybe<JSONQueryOperatorInput>;
    readonly id: InputMaybe<StringQueryOperatorInput>;
    readonly internal: InputMaybe<InternalFilterInput>;
    readonly parent: InputMaybe<NodeFilterInput>;
    readonly rawMarkdownBody: InputMaybe<StringQueryOperatorInput>;
    readonly tableOfContents: InputMaybe<StringQueryOperatorInput>;
    readonly timeToRead: InputMaybe<IntQueryOperatorInput>;
    readonly wordCount: InputMaybe<MarkdownWordCountFilterInput>;
  };

  type MarkdownRemarkFilterListInput = {
    readonly elemMatch: InputMaybe<MarkdownRemarkFilterInput>;
  };

  type MarkdownRemarkFrontmatter = {
    readonly date: Maybe<Scalars["Date"]>;
    readonly description: Maybe<Scalars["String"]>;
    readonly headerImage: Maybe<Scalars["String"]>;
    readonly id: Maybe<Scalars["String"]>;
    readonly slug: Maybe<Scalars["String"]>;
    readonly tags: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>;
    readonly templateKey: Maybe<Scalars["String"]>;
    readonly title: Maybe<Scalars["String"]>;
  };

  type MarkdownRemarkFrontmatter_dateArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type MarkdownRemarkFrontmatterFilterInput = {
    readonly date: InputMaybe<DateQueryOperatorInput>;
    readonly description: InputMaybe<StringQueryOperatorInput>;
    readonly headerImage: InputMaybe<StringQueryOperatorInput>;
    readonly id: InputMaybe<StringQueryOperatorInput>;
    readonly slug: InputMaybe<StringQueryOperatorInput>;
    readonly tags: InputMaybe<StringQueryOperatorInput>;
    readonly templateKey: InputMaybe<StringQueryOperatorInput>;
    readonly title: InputMaybe<StringQueryOperatorInput>;
  };

  type MarkdownRemarkGroupConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<MarkdownRemarkEdge>;
    readonly field: Scalars["String"];
    readonly fieldValue: Maybe<Scalars["String"]>;
    readonly group: ReadonlyArray<MarkdownRemarkGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<MarkdownRemark>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type MarkdownRemarkGroupConnection_distinctArgs = {
    field: MarkdownRemarkFieldsEnum;
  };

  type MarkdownRemarkGroupConnection_groupArgs = {
    field: MarkdownRemarkFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type MarkdownRemarkGroupConnection_maxArgs = {
    field: MarkdownRemarkFieldsEnum;
  };

  type MarkdownRemarkGroupConnection_minArgs = {
    field: MarkdownRemarkFieldsEnum;
  };

  type MarkdownRemarkGroupConnection_sumArgs = {
    field: MarkdownRemarkFieldsEnum;
  };

  type MarkdownRemarkSortInput = {
    readonly fields: InputMaybe<
      ReadonlyArray<InputMaybe<MarkdownRemarkFieldsEnum>>
    >;
    readonly order: InputMaybe<ReadonlyArray<InputMaybe<SortOrderEnum>>>;
  };

  type MarkdownWordCount = {
    readonly paragraphs: Maybe<Scalars["Int"]>;
    readonly sentences: Maybe<Scalars["Int"]>;
    readonly words: Maybe<Scalars["Int"]>;
  };

  type MarkdownWordCountFilterInput = {
    readonly paragraphs: InputMaybe<IntQueryOperatorInput>;
    readonly sentences: InputMaybe<IntQueryOperatorInput>;
    readonly words: InputMaybe<IntQueryOperatorInput>;
  };

  /** Node Interface */
  type Node = {
    readonly children: ReadonlyArray<Node>;
    readonly id: Scalars["ID"];
    readonly internal: Internal;
    readonly parent: Maybe<Node>;
  };

  type NodeFilterInput = {
    readonly children: InputMaybe<NodeFilterListInput>;
    readonly id: InputMaybe<StringQueryOperatorInput>;
    readonly internal: InputMaybe<InternalFilterInput>;
    readonly parent: InputMaybe<NodeFilterInput>;
  };

  type NodeFilterListInput = {
    readonly elemMatch: InputMaybe<NodeFilterInput>;
  };

  type PageInfo = {
    readonly currentPage: Scalars["Int"];
    readonly hasNextPage: Scalars["Boolean"];
    readonly hasPreviousPage: Scalars["Boolean"];
    readonly itemCount: Scalars["Int"];
    readonly pageCount: Scalars["Int"];
    readonly perPage: Maybe<Scalars["Int"]>;
    readonly totalCount: Scalars["Int"];
  };

  type Query = {
    readonly allDirectory: DirectoryConnection;
    readonly allFile: FileConnection;
    readonly allMarkdownRemark: MarkdownRemarkConnection;
    readonly allSite: SiteConnection;
    readonly allSiteBuildMetadata: SiteBuildMetadataConnection;
    readonly allSiteFunction: SiteFunctionConnection;
    readonly allSitePage: SitePageConnection;
    readonly allSitePlugin: SitePluginConnection;
    readonly directory: Maybe<Directory>;
    readonly file: Maybe<File>;
    readonly markdownRemark: Maybe<MarkdownRemark>;
    readonly site: Maybe<Site>;
    readonly siteBuildMetadata: Maybe<SiteBuildMetadata>;
    readonly siteFunction: Maybe<SiteFunction>;
    readonly sitePage: Maybe<SitePage>;
    readonly sitePlugin: Maybe<SitePlugin>;
  };

  type Query_allDirectoryArgs = {
    filter: InputMaybe<DirectoryFilterInput>;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
    sort: InputMaybe<DirectorySortInput>;
  };

  type Query_allFileArgs = {
    filter: InputMaybe<FileFilterInput>;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
    sort: InputMaybe<FileSortInput>;
  };

  type Query_allMarkdownRemarkArgs = {
    filter: InputMaybe<MarkdownRemarkFilterInput>;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
    sort: InputMaybe<MarkdownRemarkSortInput>;
  };

  type Query_allSiteArgs = {
    filter: InputMaybe<SiteFilterInput>;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
    sort: InputMaybe<SiteSortInput>;
  };

  type Query_allSiteBuildMetadataArgs = {
    filter: InputMaybe<SiteBuildMetadataFilterInput>;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
    sort: InputMaybe<SiteBuildMetadataSortInput>;
  };

  type Query_allSiteFunctionArgs = {
    filter: InputMaybe<SiteFunctionFilterInput>;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
    sort: InputMaybe<SiteFunctionSortInput>;
  };

  type Query_allSitePageArgs = {
    filter: InputMaybe<SitePageFilterInput>;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
    sort: InputMaybe<SitePageSortInput>;
  };

  type Query_allSitePluginArgs = {
    filter: InputMaybe<SitePluginFilterInput>;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
    sort: InputMaybe<SitePluginSortInput>;
  };

  type Query_directoryArgs = {
    absolutePath: InputMaybe<StringQueryOperatorInput>;
    accessTime: InputMaybe<DateQueryOperatorInput>;
    atime: InputMaybe<DateQueryOperatorInput>;
    atimeMs: InputMaybe<FloatQueryOperatorInput>;
    base: InputMaybe<StringQueryOperatorInput>;
    birthTime: InputMaybe<DateQueryOperatorInput>;
    birthtime: InputMaybe<DateQueryOperatorInput>;
    birthtimeMs: InputMaybe<FloatQueryOperatorInput>;
    changeTime: InputMaybe<DateQueryOperatorInput>;
    children: InputMaybe<NodeFilterListInput>;
    ctime: InputMaybe<DateQueryOperatorInput>;
    ctimeMs: InputMaybe<FloatQueryOperatorInput>;
    dev: InputMaybe<IntQueryOperatorInput>;
    dir: InputMaybe<StringQueryOperatorInput>;
    ext: InputMaybe<StringQueryOperatorInput>;
    extension: InputMaybe<StringQueryOperatorInput>;
    gid: InputMaybe<IntQueryOperatorInput>;
    id: InputMaybe<StringQueryOperatorInput>;
    ino: InputMaybe<FloatQueryOperatorInput>;
    internal: InputMaybe<InternalFilterInput>;
    mode: InputMaybe<IntQueryOperatorInput>;
    modifiedTime: InputMaybe<DateQueryOperatorInput>;
    mtime: InputMaybe<DateQueryOperatorInput>;
    mtimeMs: InputMaybe<FloatQueryOperatorInput>;
    name: InputMaybe<StringQueryOperatorInput>;
    nlink: InputMaybe<IntQueryOperatorInput>;
    parent: InputMaybe<NodeFilterInput>;
    prettySize: InputMaybe<StringQueryOperatorInput>;
    rdev: InputMaybe<IntQueryOperatorInput>;
    relativeDirectory: InputMaybe<StringQueryOperatorInput>;
    relativePath: InputMaybe<StringQueryOperatorInput>;
    root: InputMaybe<StringQueryOperatorInput>;
    size: InputMaybe<IntQueryOperatorInput>;
    sourceInstanceName: InputMaybe<StringQueryOperatorInput>;
    uid: InputMaybe<IntQueryOperatorInput>;
  };

  type Query_fileArgs = {
    absolutePath: InputMaybe<StringQueryOperatorInput>;
    accessTime: InputMaybe<DateQueryOperatorInput>;
    atime: InputMaybe<DateQueryOperatorInput>;
    atimeMs: InputMaybe<FloatQueryOperatorInput>;
    base: InputMaybe<StringQueryOperatorInput>;
    birthTime: InputMaybe<DateQueryOperatorInput>;
    birthtime: InputMaybe<DateQueryOperatorInput>;
    birthtimeMs: InputMaybe<FloatQueryOperatorInput>;
    blksize: InputMaybe<IntQueryOperatorInput>;
    blocks: InputMaybe<IntQueryOperatorInput>;
    changeTime: InputMaybe<DateQueryOperatorInput>;
    childMarkdownRemark: InputMaybe<MarkdownRemarkFilterInput>;
    children: InputMaybe<NodeFilterListInput>;
    childrenMarkdownRemark: InputMaybe<MarkdownRemarkFilterListInput>;
    ctime: InputMaybe<DateQueryOperatorInput>;
    ctimeMs: InputMaybe<FloatQueryOperatorInput>;
    dev: InputMaybe<IntQueryOperatorInput>;
    dir: InputMaybe<StringQueryOperatorInput>;
    ext: InputMaybe<StringQueryOperatorInput>;
    extension: InputMaybe<StringQueryOperatorInput>;
    gid: InputMaybe<IntQueryOperatorInput>;
    id: InputMaybe<StringQueryOperatorInput>;
    ino: InputMaybe<FloatQueryOperatorInput>;
    internal: InputMaybe<InternalFilterInput>;
    mode: InputMaybe<IntQueryOperatorInput>;
    modifiedTime: InputMaybe<DateQueryOperatorInput>;
    mtime: InputMaybe<DateQueryOperatorInput>;
    mtimeMs: InputMaybe<FloatQueryOperatorInput>;
    name: InputMaybe<StringQueryOperatorInput>;
    nlink: InputMaybe<IntQueryOperatorInput>;
    parent: InputMaybe<NodeFilterInput>;
    prettySize: InputMaybe<StringQueryOperatorInput>;
    publicURL: InputMaybe<StringQueryOperatorInput>;
    rdev: InputMaybe<IntQueryOperatorInput>;
    relativeDirectory: InputMaybe<StringQueryOperatorInput>;
    relativePath: InputMaybe<StringQueryOperatorInput>;
    root: InputMaybe<StringQueryOperatorInput>;
    size: InputMaybe<IntQueryOperatorInput>;
    sourceInstanceName: InputMaybe<StringQueryOperatorInput>;
    uid: InputMaybe<IntQueryOperatorInput>;
  };

  type Query_markdownRemarkArgs = {
    children: InputMaybe<NodeFilterListInput>;
    excerpt: InputMaybe<StringQueryOperatorInput>;
    excerptAst: InputMaybe<JSONQueryOperatorInput>;
    fields: InputMaybe<MarkdownRemarkFieldsFilterInput>;
    fileAbsolutePath: InputMaybe<StringQueryOperatorInput>;
    frontmatter: InputMaybe<MarkdownRemarkFrontmatterFilterInput>;
    headings: InputMaybe<MarkdownHeadingFilterListInput>;
    html: InputMaybe<StringQueryOperatorInput>;
    htmlAst: InputMaybe<JSONQueryOperatorInput>;
    id: InputMaybe<StringQueryOperatorInput>;
    internal: InputMaybe<InternalFilterInput>;
    parent: InputMaybe<NodeFilterInput>;
    rawMarkdownBody: InputMaybe<StringQueryOperatorInput>;
    tableOfContents: InputMaybe<StringQueryOperatorInput>;
    timeToRead: InputMaybe<IntQueryOperatorInput>;
    wordCount: InputMaybe<MarkdownWordCountFilterInput>;
  };

  type Query_siteArgs = {
    buildTime: InputMaybe<DateQueryOperatorInput>;
    children: InputMaybe<NodeFilterListInput>;
    graphqlTypegen: InputMaybe<BooleanQueryOperatorInput>;
    id: InputMaybe<StringQueryOperatorInput>;
    internal: InputMaybe<InternalFilterInput>;
    jsxRuntime: InputMaybe<StringQueryOperatorInput>;
    parent: InputMaybe<NodeFilterInput>;
    pathPrefix: InputMaybe<StringQueryOperatorInput>;
    polyfill: InputMaybe<BooleanQueryOperatorInput>;
    siteMetadata: InputMaybe<SiteSiteMetadataFilterInput>;
    trailingSlash: InputMaybe<StringQueryOperatorInput>;
  };

  type Query_siteBuildMetadataArgs = {
    buildTime: InputMaybe<DateQueryOperatorInput>;
    children: InputMaybe<NodeFilterListInput>;
    id: InputMaybe<StringQueryOperatorInput>;
    internal: InputMaybe<InternalFilterInput>;
    parent: InputMaybe<NodeFilterInput>;
  };

  type Query_siteFunctionArgs = {
    absoluteCompiledFilePath: InputMaybe<StringQueryOperatorInput>;
    children: InputMaybe<NodeFilterListInput>;
    functionRoute: InputMaybe<StringQueryOperatorInput>;
    id: InputMaybe<StringQueryOperatorInput>;
    internal: InputMaybe<InternalFilterInput>;
    matchPath: InputMaybe<StringQueryOperatorInput>;
    originalAbsoluteFilePath: InputMaybe<StringQueryOperatorInput>;
    originalRelativeFilePath: InputMaybe<StringQueryOperatorInput>;
    parent: InputMaybe<NodeFilterInput>;
    pluginName: InputMaybe<StringQueryOperatorInput>;
    relativeCompiledFilePath: InputMaybe<StringQueryOperatorInput>;
  };

  type Query_sitePageArgs = {
    children: InputMaybe<NodeFilterListInput>;
    component: InputMaybe<StringQueryOperatorInput>;
    componentChunkName: InputMaybe<StringQueryOperatorInput>;
    id: InputMaybe<StringQueryOperatorInput>;
    internal: InputMaybe<InternalFilterInput>;
    internalComponentName: InputMaybe<StringQueryOperatorInput>;
    matchPath: InputMaybe<StringQueryOperatorInput>;
    pageContext: InputMaybe<JSONQueryOperatorInput>;
    parent: InputMaybe<NodeFilterInput>;
    path: InputMaybe<StringQueryOperatorInput>;
    pluginCreator: InputMaybe<SitePluginFilterInput>;
  };

  type Query_sitePluginArgs = {
    browserAPIs: InputMaybe<StringQueryOperatorInput>;
    children: InputMaybe<NodeFilterListInput>;
    id: InputMaybe<StringQueryOperatorInput>;
    internal: InputMaybe<InternalFilterInput>;
    name: InputMaybe<StringQueryOperatorInput>;
    nodeAPIs: InputMaybe<StringQueryOperatorInput>;
    packageJson: InputMaybe<JSONQueryOperatorInput>;
    parent: InputMaybe<NodeFilterInput>;
    pluginFilepath: InputMaybe<StringQueryOperatorInput>;
    pluginOptions: InputMaybe<JSONQueryOperatorInput>;
    resolve: InputMaybe<StringQueryOperatorInput>;
    ssrAPIs: InputMaybe<StringQueryOperatorInput>;
    version: InputMaybe<StringQueryOperatorInput>;
  };

  type Site = Node & {
    readonly buildTime: Maybe<Scalars["Date"]>;
    readonly children: ReadonlyArray<Node>;
    readonly graphqlTypegen: Maybe<Scalars["Boolean"]>;
    readonly id: Scalars["ID"];
    readonly internal: Internal;
    readonly jsxRuntime: Maybe<Scalars["String"]>;
    readonly parent: Maybe<Node>;
    readonly pathPrefix: Maybe<Scalars["String"]>;
    readonly polyfill: Maybe<Scalars["Boolean"]>;
    readonly siteMetadata: Maybe<SiteSiteMetadata>;
    readonly trailingSlash: Maybe<Scalars["String"]>;
  };

  type Site_buildTimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type SiteBuildMetadata = Node & {
    readonly buildTime: Maybe<Scalars["Date"]>;
    readonly children: ReadonlyArray<Node>;
    readonly id: Scalars["ID"];
    readonly internal: Internal;
    readonly parent: Maybe<Node>;
  };

  type SiteBuildMetadata_buildTimeArgs = {
    difference: InputMaybe<Scalars["String"]>;
    formatString: InputMaybe<Scalars["String"]>;
    fromNow: InputMaybe<Scalars["Boolean"]>;
    locale: InputMaybe<Scalars["String"]>;
  };

  type SiteBuildMetadataConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<SiteBuildMetadataEdge>;
    readonly group: ReadonlyArray<SiteBuildMetadataGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<SiteBuildMetadata>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type SiteBuildMetadataConnection_distinctArgs = {
    field: SiteBuildMetadataFieldsEnum;
  };

  type SiteBuildMetadataConnection_groupArgs = {
    field: SiteBuildMetadataFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type SiteBuildMetadataConnection_maxArgs = {
    field: SiteBuildMetadataFieldsEnum;
  };

  type SiteBuildMetadataConnection_minArgs = {
    field: SiteBuildMetadataFieldsEnum;
  };

  type SiteBuildMetadataConnection_sumArgs = {
    field: SiteBuildMetadataFieldsEnum;
  };

  type SiteBuildMetadataEdge = {
    readonly next: Maybe<SiteBuildMetadata>;
    readonly node: SiteBuildMetadata;
    readonly previous: Maybe<SiteBuildMetadata>;
  };

  type SiteBuildMetadataFieldsEnum =
    | "buildTime"
    | "children"
    | "children.children"
    | "children.children.children"
    | "children.children.children.children"
    | "children.children.children.id"
    | "children.children.id"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.contentFilePath"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.children.parent.children"
    | "children.children.parent.id"
    | "children.id"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.contentFilePath"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "children.parent.children"
    | "children.parent.children.children"
    | "children.parent.children.id"
    | "children.parent.id"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.contentFilePath"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.parent.parent.children"
    | "children.parent.parent.id"
    | "id"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.contentFilePath"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"
    | "parent.children"
    | "parent.children.children"
    | "parent.children.children.children"
    | "parent.children.children.id"
    | "parent.children.id"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.contentFilePath"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.children.parent.children"
    | "parent.children.parent.id"
    | "parent.id"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.contentFilePath"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "parent.parent.children"
    | "parent.parent.children.children"
    | "parent.parent.children.id"
    | "parent.parent.id"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.contentFilePath"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.parent.parent.children"
    | "parent.parent.parent.id";

  type SiteBuildMetadataFilterInput = {
    readonly buildTime: InputMaybe<DateQueryOperatorInput>;
    readonly children: InputMaybe<NodeFilterListInput>;
    readonly id: InputMaybe<StringQueryOperatorInput>;
    readonly internal: InputMaybe<InternalFilterInput>;
    readonly parent: InputMaybe<NodeFilterInput>;
  };

  type SiteBuildMetadataGroupConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<SiteBuildMetadataEdge>;
    readonly field: Scalars["String"];
    readonly fieldValue: Maybe<Scalars["String"]>;
    readonly group: ReadonlyArray<SiteBuildMetadataGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<SiteBuildMetadata>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type SiteBuildMetadataGroupConnection_distinctArgs = {
    field: SiteBuildMetadataFieldsEnum;
  };

  type SiteBuildMetadataGroupConnection_groupArgs = {
    field: SiteBuildMetadataFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type SiteBuildMetadataGroupConnection_maxArgs = {
    field: SiteBuildMetadataFieldsEnum;
  };

  type SiteBuildMetadataGroupConnection_minArgs = {
    field: SiteBuildMetadataFieldsEnum;
  };

  type SiteBuildMetadataGroupConnection_sumArgs = {
    field: SiteBuildMetadataFieldsEnum;
  };

  type SiteBuildMetadataSortInput = {
    readonly fields: InputMaybe<
      ReadonlyArray<InputMaybe<SiteBuildMetadataFieldsEnum>>
    >;
    readonly order: InputMaybe<ReadonlyArray<InputMaybe<SortOrderEnum>>>;
  };

  type SiteConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<SiteEdge>;
    readonly group: ReadonlyArray<SiteGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<Site>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type SiteConnection_distinctArgs = {
    field: SiteFieldsEnum;
  };

  type SiteConnection_groupArgs = {
    field: SiteFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type SiteConnection_maxArgs = {
    field: SiteFieldsEnum;
  };

  type SiteConnection_minArgs = {
    field: SiteFieldsEnum;
  };

  type SiteConnection_sumArgs = {
    field: SiteFieldsEnum;
  };

  type SiteEdge = {
    readonly next: Maybe<Site>;
    readonly node: Site;
    readonly previous: Maybe<Site>;
  };

  type SiteFieldsEnum =
    | "buildTime"
    | "children"
    | "children.children"
    | "children.children.children"
    | "children.children.children.children"
    | "children.children.children.id"
    | "children.children.id"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.contentFilePath"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.children.parent.children"
    | "children.children.parent.id"
    | "children.id"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.contentFilePath"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "children.parent.children"
    | "children.parent.children.children"
    | "children.parent.children.id"
    | "children.parent.id"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.contentFilePath"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.parent.parent.children"
    | "children.parent.parent.id"
    | "graphqlTypegen"
    | "id"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.contentFilePath"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"
    | "jsxRuntime"
    | "parent.children"
    | "parent.children.children"
    | "parent.children.children.children"
    | "parent.children.children.id"
    | "parent.children.id"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.contentFilePath"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.children.parent.children"
    | "parent.children.parent.id"
    | "parent.id"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.contentFilePath"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "parent.parent.children"
    | "parent.parent.children.children"
    | "parent.parent.children.id"
    | "parent.parent.id"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.contentFilePath"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.parent.parent.children"
    | "parent.parent.parent.id"
    | "pathPrefix"
    | "polyfill"
    | "siteMetadata.author"
    | "siteMetadata.description"
    | "siteMetadata.siteUrl"
    | "siteMetadata.title"
    | "trailingSlash";

  type SiteFilterInput = {
    readonly buildTime: InputMaybe<DateQueryOperatorInput>;
    readonly children: InputMaybe<NodeFilterListInput>;
    readonly graphqlTypegen: InputMaybe<BooleanQueryOperatorInput>;
    readonly id: InputMaybe<StringQueryOperatorInput>;
    readonly internal: InputMaybe<InternalFilterInput>;
    readonly jsxRuntime: InputMaybe<StringQueryOperatorInput>;
    readonly parent: InputMaybe<NodeFilterInput>;
    readonly pathPrefix: InputMaybe<StringQueryOperatorInput>;
    readonly polyfill: InputMaybe<BooleanQueryOperatorInput>;
    readonly siteMetadata: InputMaybe<SiteSiteMetadataFilterInput>;
    readonly trailingSlash: InputMaybe<StringQueryOperatorInput>;
  };

  type SiteFunction = Node & {
    readonly absoluteCompiledFilePath: Scalars["String"];
    readonly children: ReadonlyArray<Node>;
    readonly functionRoute: Scalars["String"];
    readonly id: Scalars["ID"];
    readonly internal: Internal;
    readonly matchPath: Maybe<Scalars["String"]>;
    readonly originalAbsoluteFilePath: Scalars["String"];
    readonly originalRelativeFilePath: Scalars["String"];
    readonly parent: Maybe<Node>;
    readonly pluginName: Scalars["String"];
    readonly relativeCompiledFilePath: Scalars["String"];
  };

  type SiteFunctionConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<SiteFunctionEdge>;
    readonly group: ReadonlyArray<SiteFunctionGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<SiteFunction>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type SiteFunctionConnection_distinctArgs = {
    field: SiteFunctionFieldsEnum;
  };

  type SiteFunctionConnection_groupArgs = {
    field: SiteFunctionFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type SiteFunctionConnection_maxArgs = {
    field: SiteFunctionFieldsEnum;
  };

  type SiteFunctionConnection_minArgs = {
    field: SiteFunctionFieldsEnum;
  };

  type SiteFunctionConnection_sumArgs = {
    field: SiteFunctionFieldsEnum;
  };

  type SiteFunctionEdge = {
    readonly next: Maybe<SiteFunction>;
    readonly node: SiteFunction;
    readonly previous: Maybe<SiteFunction>;
  };

  type SiteFunctionFieldsEnum =
    | "absoluteCompiledFilePath"
    | "children"
    | "children.children"
    | "children.children.children"
    | "children.children.children.children"
    | "children.children.children.id"
    | "children.children.id"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.contentFilePath"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.children.parent.children"
    | "children.children.parent.id"
    | "children.id"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.contentFilePath"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "children.parent.children"
    | "children.parent.children.children"
    | "children.parent.children.id"
    | "children.parent.id"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.contentFilePath"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.parent.parent.children"
    | "children.parent.parent.id"
    | "functionRoute"
    | "id"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.contentFilePath"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"
    | "matchPath"
    | "originalAbsoluteFilePath"
    | "originalRelativeFilePath"
    | "parent.children"
    | "parent.children.children"
    | "parent.children.children.children"
    | "parent.children.children.id"
    | "parent.children.id"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.contentFilePath"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.children.parent.children"
    | "parent.children.parent.id"
    | "parent.id"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.contentFilePath"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "parent.parent.children"
    | "parent.parent.children.children"
    | "parent.parent.children.id"
    | "parent.parent.id"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.contentFilePath"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.parent.parent.children"
    | "parent.parent.parent.id"
    | "pluginName"
    | "relativeCompiledFilePath";

  type SiteFunctionFilterInput = {
    readonly absoluteCompiledFilePath: InputMaybe<StringQueryOperatorInput>;
    readonly children: InputMaybe<NodeFilterListInput>;
    readonly functionRoute: InputMaybe<StringQueryOperatorInput>;
    readonly id: InputMaybe<StringQueryOperatorInput>;
    readonly internal: InputMaybe<InternalFilterInput>;
    readonly matchPath: InputMaybe<StringQueryOperatorInput>;
    readonly originalAbsoluteFilePath: InputMaybe<StringQueryOperatorInput>;
    readonly originalRelativeFilePath: InputMaybe<StringQueryOperatorInput>;
    readonly parent: InputMaybe<NodeFilterInput>;
    readonly pluginName: InputMaybe<StringQueryOperatorInput>;
    readonly relativeCompiledFilePath: InputMaybe<StringQueryOperatorInput>;
  };

  type SiteFunctionGroupConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<SiteFunctionEdge>;
    readonly field: Scalars["String"];
    readonly fieldValue: Maybe<Scalars["String"]>;
    readonly group: ReadonlyArray<SiteFunctionGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<SiteFunction>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type SiteFunctionGroupConnection_distinctArgs = {
    field: SiteFunctionFieldsEnum;
  };

  type SiteFunctionGroupConnection_groupArgs = {
    field: SiteFunctionFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type SiteFunctionGroupConnection_maxArgs = {
    field: SiteFunctionFieldsEnum;
  };

  type SiteFunctionGroupConnection_minArgs = {
    field: SiteFunctionFieldsEnum;
  };

  type SiteFunctionGroupConnection_sumArgs = {
    field: SiteFunctionFieldsEnum;
  };

  type SiteFunctionSortInput = {
    readonly fields: InputMaybe<
      ReadonlyArray<InputMaybe<SiteFunctionFieldsEnum>>
    >;
    readonly order: InputMaybe<ReadonlyArray<InputMaybe<SortOrderEnum>>>;
  };

  type SiteGroupConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<SiteEdge>;
    readonly field: Scalars["String"];
    readonly fieldValue: Maybe<Scalars["String"]>;
    readonly group: ReadonlyArray<SiteGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<Site>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type SiteGroupConnection_distinctArgs = {
    field: SiteFieldsEnum;
  };

  type SiteGroupConnection_groupArgs = {
    field: SiteFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type SiteGroupConnection_maxArgs = {
    field: SiteFieldsEnum;
  };

  type SiteGroupConnection_minArgs = {
    field: SiteFieldsEnum;
  };

  type SiteGroupConnection_sumArgs = {
    field: SiteFieldsEnum;
  };

  type SitePage = Node & {
    readonly children: ReadonlyArray<Node>;
    readonly component: Scalars["String"];
    readonly componentChunkName: Scalars["String"];
    readonly id: Scalars["ID"];
    readonly internal: Internal;
    readonly internalComponentName: Scalars["String"];
    readonly matchPath: Maybe<Scalars["String"]>;
    readonly pageContext: Maybe<Scalars["JSON"]>;
    readonly parent: Maybe<Node>;
    readonly path: Scalars["String"];
    readonly pluginCreator: Maybe<SitePlugin>;
  };

  type SitePageConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<SitePageEdge>;
    readonly group: ReadonlyArray<SitePageGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<SitePage>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type SitePageConnection_distinctArgs = {
    field: SitePageFieldsEnum;
  };

  type SitePageConnection_groupArgs = {
    field: SitePageFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type SitePageConnection_maxArgs = {
    field: SitePageFieldsEnum;
  };

  type SitePageConnection_minArgs = {
    field: SitePageFieldsEnum;
  };

  type SitePageConnection_sumArgs = {
    field: SitePageFieldsEnum;
  };

  type SitePageEdge = {
    readonly next: Maybe<SitePage>;
    readonly node: SitePage;
    readonly previous: Maybe<SitePage>;
  };

  type SitePageFieldsEnum =
    | "children"
    | "children.children"
    | "children.children.children"
    | "children.children.children.children"
    | "children.children.children.id"
    | "children.children.id"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.contentFilePath"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.children.parent.children"
    | "children.children.parent.id"
    | "children.id"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.contentFilePath"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "children.parent.children"
    | "children.parent.children.children"
    | "children.parent.children.id"
    | "children.parent.id"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.contentFilePath"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.parent.parent.children"
    | "children.parent.parent.id"
    | "component"
    | "componentChunkName"
    | "id"
    | "internalComponentName"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.contentFilePath"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"
    | "matchPath"
    | "pageContext"
    | "parent.children"
    | "parent.children.children"
    | "parent.children.children.children"
    | "parent.children.children.id"
    | "parent.children.id"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.contentFilePath"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.children.parent.children"
    | "parent.children.parent.id"
    | "parent.id"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.contentFilePath"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "parent.parent.children"
    | "parent.parent.children.children"
    | "parent.parent.children.id"
    | "parent.parent.id"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.contentFilePath"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.parent.parent.children"
    | "parent.parent.parent.id"
    | "path"
    | "pluginCreator.browserAPIs"
    | "pluginCreator.children"
    | "pluginCreator.children.children"
    | "pluginCreator.children.children.children"
    | "pluginCreator.children.children.id"
    | "pluginCreator.children.id"
    | "pluginCreator.children.internal.content"
    | "pluginCreator.children.internal.contentDigest"
    | "pluginCreator.children.internal.contentFilePath"
    | "pluginCreator.children.internal.description"
    | "pluginCreator.children.internal.fieldOwners"
    | "pluginCreator.children.internal.ignoreType"
    | "pluginCreator.children.internal.mediaType"
    | "pluginCreator.children.internal.owner"
    | "pluginCreator.children.internal.type"
    | "pluginCreator.children.parent.children"
    | "pluginCreator.children.parent.id"
    | "pluginCreator.id"
    | "pluginCreator.internal.content"
    | "pluginCreator.internal.contentDigest"
    | "pluginCreator.internal.contentFilePath"
    | "pluginCreator.internal.description"
    | "pluginCreator.internal.fieldOwners"
    | "pluginCreator.internal.ignoreType"
    | "pluginCreator.internal.mediaType"
    | "pluginCreator.internal.owner"
    | "pluginCreator.internal.type"
    | "pluginCreator.name"
    | "pluginCreator.nodeAPIs"
    | "pluginCreator.packageJson"
    | "pluginCreator.parent.children"
    | "pluginCreator.parent.children.children"
    | "pluginCreator.parent.children.id"
    | "pluginCreator.parent.id"
    | "pluginCreator.parent.internal.content"
    | "pluginCreator.parent.internal.contentDigest"
    | "pluginCreator.parent.internal.contentFilePath"
    | "pluginCreator.parent.internal.description"
    | "pluginCreator.parent.internal.fieldOwners"
    | "pluginCreator.parent.internal.ignoreType"
    | "pluginCreator.parent.internal.mediaType"
    | "pluginCreator.parent.internal.owner"
    | "pluginCreator.parent.internal.type"
    | "pluginCreator.parent.parent.children"
    | "pluginCreator.parent.parent.id"
    | "pluginCreator.pluginFilepath"
    | "pluginCreator.pluginOptions"
    | "pluginCreator.resolve"
    | "pluginCreator.ssrAPIs"
    | "pluginCreator.version";

  type SitePageFilterInput = {
    readonly children: InputMaybe<NodeFilterListInput>;
    readonly component: InputMaybe<StringQueryOperatorInput>;
    readonly componentChunkName: InputMaybe<StringQueryOperatorInput>;
    readonly id: InputMaybe<StringQueryOperatorInput>;
    readonly internal: InputMaybe<InternalFilterInput>;
    readonly internalComponentName: InputMaybe<StringQueryOperatorInput>;
    readonly matchPath: InputMaybe<StringQueryOperatorInput>;
    readonly pageContext: InputMaybe<JSONQueryOperatorInput>;
    readonly parent: InputMaybe<NodeFilterInput>;
    readonly path: InputMaybe<StringQueryOperatorInput>;
    readonly pluginCreator: InputMaybe<SitePluginFilterInput>;
  };

  type SitePageGroupConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<SitePageEdge>;
    readonly field: Scalars["String"];
    readonly fieldValue: Maybe<Scalars["String"]>;
    readonly group: ReadonlyArray<SitePageGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<SitePage>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type SitePageGroupConnection_distinctArgs = {
    field: SitePageFieldsEnum;
  };

  type SitePageGroupConnection_groupArgs = {
    field: SitePageFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type SitePageGroupConnection_maxArgs = {
    field: SitePageFieldsEnum;
  };

  type SitePageGroupConnection_minArgs = {
    field: SitePageFieldsEnum;
  };

  type SitePageGroupConnection_sumArgs = {
    field: SitePageFieldsEnum;
  };

  type SitePageSortInput = {
    readonly fields: InputMaybe<ReadonlyArray<InputMaybe<SitePageFieldsEnum>>>;
    readonly order: InputMaybe<ReadonlyArray<InputMaybe<SortOrderEnum>>>;
  };

  type SitePlugin = Node & {
    readonly browserAPIs: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>;
    readonly children: ReadonlyArray<Node>;
    readonly id: Scalars["ID"];
    readonly internal: Internal;
    readonly name: Maybe<Scalars["String"]>;
    readonly nodeAPIs: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>;
    readonly packageJson: Maybe<Scalars["JSON"]>;
    readonly parent: Maybe<Node>;
    readonly pluginFilepath: Maybe<Scalars["String"]>;
    readonly pluginOptions: Maybe<Scalars["JSON"]>;
    readonly resolve: Maybe<Scalars["String"]>;
    readonly ssrAPIs: Maybe<ReadonlyArray<Maybe<Scalars["String"]>>>;
    readonly version: Maybe<Scalars["String"]>;
  };

  type SitePluginConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<SitePluginEdge>;
    readonly group: ReadonlyArray<SitePluginGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<SitePlugin>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type SitePluginConnection_distinctArgs = {
    field: SitePluginFieldsEnum;
  };

  type SitePluginConnection_groupArgs = {
    field: SitePluginFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type SitePluginConnection_maxArgs = {
    field: SitePluginFieldsEnum;
  };

  type SitePluginConnection_minArgs = {
    field: SitePluginFieldsEnum;
  };

  type SitePluginConnection_sumArgs = {
    field: SitePluginFieldsEnum;
  };

  type SitePluginEdge = {
    readonly next: Maybe<SitePlugin>;
    readonly node: SitePlugin;
    readonly previous: Maybe<SitePlugin>;
  };

  type SitePluginFieldsEnum =
    | "browserAPIs"
    | "children"
    | "children.children"
    | "children.children.children"
    | "children.children.children.children"
    | "children.children.children.id"
    | "children.children.id"
    | "children.children.internal.content"
    | "children.children.internal.contentDigest"
    | "children.children.internal.contentFilePath"
    | "children.children.internal.description"
    | "children.children.internal.fieldOwners"
    | "children.children.internal.ignoreType"
    | "children.children.internal.mediaType"
    | "children.children.internal.owner"
    | "children.children.internal.type"
    | "children.children.parent.children"
    | "children.children.parent.id"
    | "children.id"
    | "children.internal.content"
    | "children.internal.contentDigest"
    | "children.internal.contentFilePath"
    | "children.internal.description"
    | "children.internal.fieldOwners"
    | "children.internal.ignoreType"
    | "children.internal.mediaType"
    | "children.internal.owner"
    | "children.internal.type"
    | "children.parent.children"
    | "children.parent.children.children"
    | "children.parent.children.id"
    | "children.parent.id"
    | "children.parent.internal.content"
    | "children.parent.internal.contentDigest"
    | "children.parent.internal.contentFilePath"
    | "children.parent.internal.description"
    | "children.parent.internal.fieldOwners"
    | "children.parent.internal.ignoreType"
    | "children.parent.internal.mediaType"
    | "children.parent.internal.owner"
    | "children.parent.internal.type"
    | "children.parent.parent.children"
    | "children.parent.parent.id"
    | "id"
    | "internal.content"
    | "internal.contentDigest"
    | "internal.contentFilePath"
    | "internal.description"
    | "internal.fieldOwners"
    | "internal.ignoreType"
    | "internal.mediaType"
    | "internal.owner"
    | "internal.type"
    | "name"
    | "nodeAPIs"
    | "packageJson"
    | "parent.children"
    | "parent.children.children"
    | "parent.children.children.children"
    | "parent.children.children.id"
    | "parent.children.id"
    | "parent.children.internal.content"
    | "parent.children.internal.contentDigest"
    | "parent.children.internal.contentFilePath"
    | "parent.children.internal.description"
    | "parent.children.internal.fieldOwners"
    | "parent.children.internal.ignoreType"
    | "parent.children.internal.mediaType"
    | "parent.children.internal.owner"
    | "parent.children.internal.type"
    | "parent.children.parent.children"
    | "parent.children.parent.id"
    | "parent.id"
    | "parent.internal.content"
    | "parent.internal.contentDigest"
    | "parent.internal.contentFilePath"
    | "parent.internal.description"
    | "parent.internal.fieldOwners"
    | "parent.internal.ignoreType"
    | "parent.internal.mediaType"
    | "parent.internal.owner"
    | "parent.internal.type"
    | "parent.parent.children"
    | "parent.parent.children.children"
    | "parent.parent.children.id"
    | "parent.parent.id"
    | "parent.parent.internal.content"
    | "parent.parent.internal.contentDigest"
    | "parent.parent.internal.contentFilePath"
    | "parent.parent.internal.description"
    | "parent.parent.internal.fieldOwners"
    | "parent.parent.internal.ignoreType"
    | "parent.parent.internal.mediaType"
    | "parent.parent.internal.owner"
    | "parent.parent.internal.type"
    | "parent.parent.parent.children"
    | "parent.parent.parent.id"
    | "pluginFilepath"
    | "pluginOptions"
    | "resolve"
    | "ssrAPIs"
    | "version";

  type SitePluginFilterInput = {
    readonly browserAPIs: InputMaybe<StringQueryOperatorInput>;
    readonly children: InputMaybe<NodeFilterListInput>;
    readonly id: InputMaybe<StringQueryOperatorInput>;
    readonly internal: InputMaybe<InternalFilterInput>;
    readonly name: InputMaybe<StringQueryOperatorInput>;
    readonly nodeAPIs: InputMaybe<StringQueryOperatorInput>;
    readonly packageJson: InputMaybe<JSONQueryOperatorInput>;
    readonly parent: InputMaybe<NodeFilterInput>;
    readonly pluginFilepath: InputMaybe<StringQueryOperatorInput>;
    readonly pluginOptions: InputMaybe<JSONQueryOperatorInput>;
    readonly resolve: InputMaybe<StringQueryOperatorInput>;
    readonly ssrAPIs: InputMaybe<StringQueryOperatorInput>;
    readonly version: InputMaybe<StringQueryOperatorInput>;
  };

  type SitePluginGroupConnection = {
    readonly distinct: ReadonlyArray<Scalars["String"]>;
    readonly edges: ReadonlyArray<SitePluginEdge>;
    readonly field: Scalars["String"];
    readonly fieldValue: Maybe<Scalars["String"]>;
    readonly group: ReadonlyArray<SitePluginGroupConnection>;
    readonly max: Maybe<Scalars["Float"]>;
    readonly min: Maybe<Scalars["Float"]>;
    readonly nodes: ReadonlyArray<SitePlugin>;
    readonly pageInfo: PageInfo;
    readonly sum: Maybe<Scalars["Float"]>;
    readonly totalCount: Scalars["Int"];
  };

  type SitePluginGroupConnection_distinctArgs = {
    field: SitePluginFieldsEnum;
  };

  type SitePluginGroupConnection_groupArgs = {
    field: SitePluginFieldsEnum;
    limit: InputMaybe<Scalars["Int"]>;
    skip: InputMaybe<Scalars["Int"]>;
  };

  type SitePluginGroupConnection_maxArgs = {
    field: SitePluginFieldsEnum;
  };

  type SitePluginGroupConnection_minArgs = {
    field: SitePluginFieldsEnum;
  };

  type SitePluginGroupConnection_sumArgs = {
    field: SitePluginFieldsEnum;
  };

  type SitePluginSortInput = {
    readonly fields: InputMaybe<
      ReadonlyArray<InputMaybe<SitePluginFieldsEnum>>
    >;
    readonly order: InputMaybe<ReadonlyArray<InputMaybe<SortOrderEnum>>>;
  };

  type SiteSiteMetadata = {
    readonly author: Maybe<Scalars["String"]>;
    readonly description: Maybe<Scalars["String"]>;
    readonly siteUrl: Maybe<Scalars["String"]>;
    readonly title: Maybe<Scalars["String"]>;
  };

  type SiteSiteMetadataFilterInput = {
    readonly author: InputMaybe<StringQueryOperatorInput>;
    readonly description: InputMaybe<StringQueryOperatorInput>;
    readonly siteUrl: InputMaybe<StringQueryOperatorInput>;
    readonly title: InputMaybe<StringQueryOperatorInput>;
  };

  type SiteSortInput = {
    readonly fields: InputMaybe<ReadonlyArray<InputMaybe<SiteFieldsEnum>>>;
    readonly order: InputMaybe<ReadonlyArray<InputMaybe<SortOrderEnum>>>;
  };

  type SortOrderEnum = "ASC" | "DESC";

  type StringQueryOperatorInput = {
    readonly eq: InputMaybe<Scalars["String"]>;
    readonly glob: InputMaybe<Scalars["String"]>;
    readonly in: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>;
    readonly ne: InputMaybe<Scalars["String"]>;
    readonly nin: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]>>>;
    readonly regex: InputMaybe<Scalars["String"]>;
  };

  type postFragment = {
    readonly fields: { readonly slug: string | null } | null;
    readonly frontmatter: {
      readonly id: string | null;
      readonly title: string | null;
      readonly slug: string | null;
      readonly date: string | null;
      readonly headerImage: string | null;
      readonly tags: ReadonlyArray<string | null> | null;
    } | null;
  };

  type cardDataFragment = {
    readonly fields: { readonly slug: string | null } | null;
    readonly frontmatter: {
      readonly title: string | null;
      readonly date: string | null;
      readonly url: string | null;
    } | null;
  };

  type BlogPostQueryQueryVariables = Exact<{
    index: InputMaybe<Scalars["Int"]>;
  }>;

  type BlogPostQueryQuery = {
    readonly content: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly excerpt: string | null;
          readonly fields: { readonly slug: string | null } | null;
          readonly frontmatter: {
            readonly id: string | null;
            readonly title: string | null;
            readonly slug: string | null;
            readonly date: string | null;
            readonly headerImage: string | null;
            readonly tags: ReadonlyArray<string | null> | null;
          } | null;
        };
      }>;
    };
  };

  type PeriodQueryQueryVariables = Exact<{
    periodStartDate: InputMaybe<Scalars["Date"]>;
    periodEndDate: InputMaybe<Scalars["Date"]>;
  }>;

  type PeriodQueryQuery = {
    readonly allMarkdownRemark: {
      readonly totalCount: number;
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly frontmatter: {
            readonly id: string | null;
            readonly title: string | null;
            readonly date: string | null;
            readonly tags: ReadonlyArray<string | null> | null;
            readonly headerImage: string | null;
            readonly description: string | null;
            readonly url: string | null;
            readonly yyyymmdd: string | null;
          } | null;
        };
      }>;
    };
  };

  type SidebarQueryQueryVariables = Exact<{ [key: string]: never }>;

  type SidebarQueryQuery = {
    readonly all: {
      readonly totalCount: number;
      readonly allPosts: ReadonlyArray<{
        readonly node: {
          readonly frontmatter: {
            readonly date: string | null;
            readonly tags: ReadonlyArray<string | null> | null;
          } | null;
        };
      }>;
    };
    readonly limited: {
      readonly latestPosts: ReadonlyArray<{
        readonly node: {
          readonly fields: { readonly slug: string | null } | null;
          readonly frontmatter: {
            readonly title: string | null;
            readonly date: string | null;
            readonly url: string | null;
          } | null;
        };
      }>;
    };
  };

  type getAllPagesQueryVariables = Exact<{ [key: string]: never }>;

  type getAllPagesQuery = {
    readonly allSitePage: {
      readonly edges: ReadonlyArray<{
        readonly node: { readonly path: string };
      }>;
    };
  };

  type getAllTagsQueryVariables = Exact<{ [key: string]: never }>;

  type getAllTagsQuery = {
    readonly allMarkdownRemark: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly frontmatter: {
            readonly tags: ReadonlyArray<string | null> | null;
          } | null;
        };
      }>;
    };
  };

  type tagQueryQueryVariables = Exact<{
    tag: InputMaybe<ReadonlyArray<Scalars["String"]> | Scalars["String"]>;
  }>;

  type tagQueryQuery = {
    readonly allMarkdownRemark: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly frontmatter: {
            readonly id: string | null;
            readonly title: string | null;
            readonly date: string | null;
            readonly tags: ReadonlyArray<string | null> | null;
            readonly headerImage: string | null;
            readonly description: string | null;
            readonly url: string | null;
          } | null;
        };
      }>;
    };
  };
}
