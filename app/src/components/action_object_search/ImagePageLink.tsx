import { Link } from '@chakra-ui/react';
import {
  IRI_KEY,
  MAIN_OBJECT_KEY,
  TARGET_OBJECT_KEY,
} from 'constants/action_object_search/constants';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type ImagePageLinkProps = {
  linkText: string;
  mainObject: string;
  targetObject: string;
  iri: string;
};
export function ImagePageLink({
  linkText,
  mainObject,
  targetObject,
  iri,
}: ImagePageLinkProps): React.ReactElement {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    const imageSearchParams = new URLSearchParams({
      [MAIN_OBJECT_KEY]: mainObject,
      [TARGET_OBJECT_KEY]: targetObject,
      [IRI_KEY]: iri,
    });

    const imageSearchParamsString = imageSearchParams.toString();
    const path =
      '/action-object-search/2d-bbox-image?' + imageSearchParamsString;

    const videoSearchParams = new URLSearchParams(window.location.search);
    localStorage.removeItem(imageSearchParamsString);
    localStorage.setItem(imageSearchParamsString, videoSearchParams.toString());
    navigate(path);
  }, []);

  return <Link onClick={handleClick}>{linkText}</Link>;
}
