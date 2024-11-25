import { Button, ButtonGroup, HStack } from '@chakra-ui/react';
import {
  type SearchParamKey,
  SEARCH_RESULT_PAGE_KEY,
  TOTAL_VIDEOS_PER_PAGE,
} from 'constants/action_object_search/constants';
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
      handleSearchParamsChange(SEARCH_RESULT_PAGE_KEY, page);
    },
    [setSearchResultPage, handleSearchParamsChange]
  );

  const hasPreviousPage = displayedPagesStart !== 1;
  const hasNextPage = displayedPagesStart + totalDisplayablePages <= totalPages;

  const handlePageMoveButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const direction = event.currentTarget.dataset.direction;
      if (direction === undefined) {
        return;
      }
      switch (direction) {
        case 'previous':
          if (!hasPreviousPage) {
            return;
          }
          setDisplayedPagesStart(
            (prevDisplayedPagesStart) =>
              prevDisplayedPagesStart - totalDisplayablePages
          );
          break;

        case 'next':
          if (!hasNextPage) {
            return;
          }
          setDisplayedPagesStart(
            (prevDisplayedPagesStart) =>
              prevDisplayedPagesStart + totalDisplayablePages
          );
          break;
      }
    },
    [
      displayedPagesStart,
      setDisplayedPagesStart,
      totalDisplayablePages,
      totalPages,
    ]
  );

  return (
    <HStack mx="auto" my={2}>
      <Button
        data-direction="previous"
        onClick={handlePageMoveButtonClick}
        isDisabled={!hasPreviousPage}
      >
        Previous
      </Button>
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
      <Button
        data-direction="next"
        onClick={handlePageMoveButtonClick}
        isDisabled={!hasNextPage}
      >
        Next
      </Button>
    </HStack>
  );
}
