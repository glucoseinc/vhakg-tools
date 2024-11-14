import { Button, ButtonGroup, HStack } from '@chakra-ui/react';
import { TOTAL_VIDEOS_PER_PAGE } from 'action_object_search/constants';
import React, { useEffect, useState } from 'react';

type PaginationProps = {
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
  totalVideos: number;
  totalDisplayablePages?: number;
};
export function Pagination({
  searchParams,
  setSearchParams,
  totalVideos,
  totalDisplayablePages = 10,
}: PaginationProps): React.ReactElement {
  const totalPages = Math.ceil(totalVideos / TOTAL_VIDEOS_PER_PAGE);

  const [displayedPagesStart, setDisplayedPagesStart] = useState(1);
  const [displayedPages, setDisplayedPages] = useState<number[]>(
    makeDisplayedPagesArray(displayedPagesStart)
  );

  function makeDisplayedPagesArray(displayedPagesStart: number) {
    return [...Array(totalPages).keys()]
      .map((i) => i + 1)
      .splice(displayedPagesStart - 1, totalDisplayablePages);
  }

  useEffect(() => {
    setDisplayedPages(makeDisplayedPagesArray(displayedPagesStart));
  }, [displayedPagesStart]);

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
            colorScheme={
              pageNumber === Number(searchParams.get('searchResultPage'))
                ? 'blue'
                : 'gray'
            }
          >
            {pageNumber}
          </Button>
        ))}
      </ButtonGroup>
      <Button onClick={() => handlePageMoveButtonClick('next')}>Next</Button>
    </HStack>
  );
}
