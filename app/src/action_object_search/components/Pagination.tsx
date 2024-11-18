import { Button, ButtonGroup, HStack } from '@chakra-ui/react';
import { searchResultPageKey } from 'action_object_search/ActionObjectSearch';
import { TOTAL_VIDEOS_PER_PAGE } from 'action_object_search/constants';
import React, { useState } from 'react';

type PaginationProps = {
  searchResultPage: number;
  setSearchResultPage: (searchResultPage: number) => void;
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
  totalVideos: number;
  totalDisplayablePages?: number;
};
export function Pagination({
  searchResultPage,
  setSearchResultPage,
  searchParams,
  setSearchParams,
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

  const handlePageNumberButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const page = event.currentTarget.dataset.page;
    if (page === undefined) {
      return;
    }
    setSearchResultPage(Number(page));
    searchParams.set(searchResultPageKey, page);
    setSearchParams(searchParams);
  };

  const displayPreviousPage = () => {
    if (displayedPagesStart === 1) {
      return;
    }
    setDisplayedPagesStart(
      (prevDisplayedPagesStart) =>
        prevDisplayedPagesStart - totalDisplayablePages
    );
  };

  const displayNextPage = () => {
    if (displayedPagesStart + totalDisplayablePages > totalPages) {
      return;
    }
    setDisplayedPagesStart(
      (prevDisplayedPagesStart) =>
        prevDisplayedPagesStart + totalDisplayablePages
    );
  };

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
