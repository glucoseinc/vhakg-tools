import { Button, ButtonGroup, HStack } from '@chakra-ui/react';
import { type SearchParamKey } from 'constants/action_object_search/constants';
import React, { useCallback, useState } from 'react';

type PaginationProps = {
  pageState: number;
  setPageState: (searchResultPage: number) => void;
  pageKey: SearchParamKey;
  handleSearchParamsChange: (key: SearchParamKey, value: string) => void;
  totalElements: number;
  totalElementsPerPage: number;
  totalDisplayablePages?: number;
};
export function Pagination({
  pageState,
  setPageState,
  pageKey,
  handleSearchParamsChange,
  totalElements,
  totalElementsPerPage,
  totalDisplayablePages = 10,
}: PaginationProps): React.ReactElement {
  const totalPages = Math.ceil(totalElements / totalElementsPerPage);

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
      setPageState(Number(page));
      handleSearchParamsChange(pageKey, page);
    },
    [handleSearchParamsChange, pageKey, setPageState]
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
            colorScheme={pageNumber === pageState ? 'blue' : 'gray'}
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
