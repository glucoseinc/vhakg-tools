import { Button, ButtonGroup, HStack } from '@chakra-ui/react';
import {
  SearchParamKey,
  searchResultPageKey,
} from 'action_object_search/constants';
import { TOTAL_VIDEOS_PER_PAGE } from 'action_object_search/constants';
import React, { useCallback, useState } from 'react';

type PaginationProps = {
  searchResultPage: number;
  setSearchResultPage: (searchResultPage: number) => void;
  handleSearchParamsChange: (key: SearchParamKey, value: string) => void;
  totalVideos: number;
  totalDisplayablePages?: number;
};
export function Pagination({
  searchResultPage,
  setSearchResultPage,
  handleSearchParamsChange,
  totalVideos,
  totalDisplayablePages = 10,
}: PaginationProps): React.ReactElement {
  const totalPages = Math.ceil(totalVideos / TOTAL_VIDEOS_PER_PAGE);

  const makeDisplayedPagesArray = (displayedPagesStart: number) => {
    return [...Array(totalDisplayablePages).keys()]
      .map((i) => displayedPagesStart + i)
      .filter((pageNumber) => pageNumber <= totalPages);
  };

  const [displayedPagesStart, setDisplayedPagesStart] = useState(1);
  const displayedPages = makeDisplayedPagesArray(displayedPagesStart);

  const handlePageNumberButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const page = event.currentTarget.dataset.page;
      if (page === undefined) {
        return;
      }
      setSearchResultPage(Number(page));
      handleSearchParamsChange(searchResultPageKey, page);
    },
    [setSearchResultPage, handleSearchParamsChange]
  );

  const displayPreviousPage = useCallback(() => {
    if (displayedPagesStart === 1) {
      return;
    }
    setDisplayedPagesStart(
      (prevDisplayedPagesStart) =>
        prevDisplayedPagesStart - totalDisplayablePages
    );
  }, [displayedPagesStart]);

  const displayNextPage = useCallback(() => {
    if (displayedPagesStart + totalDisplayablePages > totalPages) {
      return;
    }
    setDisplayedPagesStart(
      (prevDisplayedPagesStart) =>
        prevDisplayedPagesStart + totalDisplayablePages
    );
  }, [displayedPagesStart, totalPages]);

  return (
    <HStack mx="auto" my={2}>
      <Button onClick={displayPreviousPage}>Previous</Button>
      <ButtonGroup>
        {displayedPages.map((pageNumber) => (
          <Button
            key={pageNumber}
            data-page={pageNumber}
            onClick={handlePageNumberButtonClick}
            width={'50px'}
            colorScheme={pageNumber === searchResultPage ? 'blue' : 'gray'}
          >
            {pageNumber}
          </Button>
        ))}
      </ButtonGroup>
      <Button onClick={displayNextPage}>Next</Button>
    </HStack>
  );
}
