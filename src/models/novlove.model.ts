export type ListRequest = {
  Querystring: {
    page?: string;
  };
};

export type ListsRequest = ListRequest & {
  Params: {
    list: string;
    listType: string;
  };
};

export type NovelRequest = {
  Params: {
    name: string;
  };
};

export type ChapterRequest = NovelRequest & {
  Params: {
    chapter: string;
  };
};
