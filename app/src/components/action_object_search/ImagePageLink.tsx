import { Link } from '@chakra-ui/react';
import {
  IRI_KEY,
  IS_VIDEO_SEGMENT_KEY,
  MAIN_OBJECT_KEY,
  TARGET_OBJECT_KEY,
} from 'constants/action_object_search/constants';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type ImagePageLinkProps = {
  linkText: string;
  mainObject: string;
  targetObject: string;
  isVideoSegment: boolean;
  iri: string;
};
export function ImagePageLink({
  linkText,
  mainObject,
  targetObject,
  isVideoSegment,
  iri,
}: ImagePageLinkProps): React.ReactElement {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    const videoSearchParams = new URLSearchParams(window.location.search);
    const sessionStorageKey = 'searchParams';
    sessionStorage.removeItem(sessionStorageKey);
    sessionStorage.setItem(sessionStorageKey, videoSearchParams.toString());

    const imageSearchParams = new URLSearchParams({
      [MAIN_OBJECT_KEY]: mainObject,
      [TARGET_OBJECT_KEY]: targetObject,
      [IS_VIDEO_SEGMENT_KEY]: isVideoSegment.toString(),
      [IRI_KEY]: iri,
    });
    const path =
      '/action-object-search/2d-bbox-image?' + imageSearchParams.toString();
    navigate(path);
  }, []);

  return <Link onClick={handleClick}>{linkText}</Link>;
}
