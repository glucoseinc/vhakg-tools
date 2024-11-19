export const TOTAL_VIDEOS_PER_PAGE = 9;

export type SearchParamObjectKey = 'mainObject' | 'targetObject';
export type SearchParamKey =
  | 'action'
  | 'videoDuration'
  | 'searchResultPage'
  | 'scene'
  | SearchParamObjectKey;
export const ACTION_KEY: SearchParamKey = 'action';
export const MAIN_OBJECT_KEY: SearchParamKey = 'mainObject';
export const TARGET_OBJECT_KEY: SearchParamKey = 'targetObject';
export const VIDEO_DURATION_KEY: SearchParamKey = 'videoDuration';
export const SEARCH_RESULT_PAGE_KEY: SearchParamKey = 'searchResultPage';
export const SCENE_KEY: SearchParamKey = 'scene';
