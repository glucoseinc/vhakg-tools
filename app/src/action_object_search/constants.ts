export const TOTAL_VIDEOS_PER_PAGE = 9;

export type SearchParamObjectKey = 'mainObject' | 'targetObject';
export type SearchParamKey =
  | 'selectedAction'
  | 'selectedVideoDuration'
  | 'searchResultPage'
  | SearchParamObjectKey;
export const SELETED_ACTION_KEY: SearchParamKey = 'selectedAction';
export const MAIN_OBJECT_KEY: SearchParamKey = 'mainObject';
export const TARGET_OBJECT_KEY: SearchParamKey = 'targetObject';
export const SELETED_VIDEO_DURATION_KEY: SearchParamKey =
  'selectedVideoDuration';
export const SEARCH_RESULT_PAGE_KEY: SearchParamKey = 'searchResultPage';
