import { Button, ButtonGroup, HStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

type PaginationProps = {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  totalDisplayablePages?: number;
};
export function Pagination({
  page,
  setPage,
  totalPages,
  totalDisplayablePages = 10,
}: PaginationProps): React.ReactElement {
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
    if (direction === 'next') {
      if (displayedPagesStart + totalDisplayablePages > totalPages) {
        return;
      }
      setDisplayedPagesStart(
        (prevDisplayedPagesStart) =>
          prevDisplayedPagesStart + totalDisplayablePages
      );
    }
    if (direction === 'previous') {
      if (displayedPagesStart === 1) {
        return;
      }
      setDisplayedPagesStart(
        (prevDisplayedPagesStart) =>
          prevDisplayedPagesStart - totalDisplayablePages
      );
    }
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
            onClick={() => setPage(pageNumber)}
            width={'50px'}
            colorScheme={pageNumber === page ? 'blue' : 'gray'}
          >
            {pageNumber}
          </Button>
        ))}
      </ButtonGroup>
      <Button onClick={() => handlePageMoveButtonClick('next')}>Next</Button>
    </HStack>
  );
}
