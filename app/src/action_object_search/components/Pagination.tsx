import { Button, ButtonGroup, HStack } from '@chakra-ui/react';
import { TOTAL_VIDEOS_PER_PAGE } from 'action_object_search/constants';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type PaginationProps = {
  searchResultPage: number;
  setSearchResultPage: (searchResultPage: number) => void;
  totalVideos: number;
  totalDisplayablePages?: number;
};
export function Pagination({
  searchResultPage,
  setSearchResultPage,
  totalVideos,
  totalDisplayablePages = 10,
}: PaginationProps): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();

  const totalPages = Math.ceil(totalVideos / TOTAL_VIDEOS_PER_PAGE);

  const makeDisplayedPagesArray = (displayedPagesStart: number) => {
    return [...Array(totalDisplayablePages).keys()]
      .map((i) => displayedPagesStart + i)
      .filter((pageNumber) => pageNumber <= totalPages);
  };

  const [displayedPagesStart, setDisplayedPagesStart] = useState(1);
  const displayedPages = makeDisplayedPagesArray(displayedPagesStart);

  const handlePageMoveButtonClick = (direction: 'next' | 'previous') => {
    switch (direction) {
      case 'next':
        if (displayedPagesStart + totalDisplayablePages > totalPages) {
          return;
        }
        setDisplayedPagesStart(
          (prevDisplayedPagesStart) =>
            prevDisplayedPagesStart + totalDisplayablePages
        );
        break;
      case 'previous':
        if (displayedPagesStart === 1) {
          return;
        }
        setDisplayedPagesStart(
          (prevDisplayedPagesStart) =>
            prevDisplayedPagesStart - totalDisplayablePages
        );
        break;
    }
  };

  const handlePageNumberButtonClick = (pageNumber: number) => {
    setSearchResultPage(pageNumber);
    searchParams.set('searchResultPage', pageNumber.toString());
    setSearchParams(searchParams);
  };

  return (
    <HStack mx="auto" my={2}>
      <Button onClick={() => handlePageMoveButtonClick('previous')}>
        Previous
      </Button>
      <ButtonGroup>
        {displayedPages.map((pageNumber) => (
          <Button
            key={pageNumber}
            onClick={() => handlePageNumberButtonClick(pageNumber)}
            width={'50px'}
            colorScheme={pageNumber === searchResultPage ? 'blue' : 'gray'}
          >
            {pageNumber}
          </Button>
        ))}
      </ButtonGroup>
      <Button onClick={() => handlePageMoveButtonClick('next')}>Next</Button>
    </HStack>
  );
}
