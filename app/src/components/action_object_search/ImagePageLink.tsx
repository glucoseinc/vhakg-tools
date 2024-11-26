import { Link } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import {
  IRI_KEY,
  MAIN_OBJECT_KEY,
  TARGET_OBJECT_KEY,
} from 'constants/action_object_search/constants';
import React from 'react';

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
  const imageSearchParams = new URLSearchParams({
    [MAIN_OBJECT_KEY]: mainObject,
    [TARGET_OBJECT_KEY]: targetObject,
    [IRI_KEY]: iri,
  });
  const path =
    '/action-object-search/2d-bbox-image?' + imageSearchParams.toString();
  return (
    <Link as={ReactRouterLink} to={path}>
      {linkText}
    </Link>
  );
}
