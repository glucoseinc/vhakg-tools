export const TOTAL_VIDEOS_PER_PAGE = 9;

export type SearchParamObjectKey = 'mainObject' | 'targetObject';
export type SearchParamKey =
  | 'selectedAction'
  | 'selectedVideoDuration'
  | 'searchResultPage'
  | SearchParamObjectKey;
export const selectedActionKey: SearchParamKey = 'selectedAction';
export const mainObjectKey: SearchParamKey = 'mainObject';
export const targetObjectKey: SearchParamKey = 'targetObject';
export const selectedVideoDurationKey: SearchParamKey = 'selectedVideoDuration';
export const searchResultPageKey: SearchParamKey = 'searchResultPage';
