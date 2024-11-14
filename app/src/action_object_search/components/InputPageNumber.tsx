import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Td,
  Th,
  Tr,
} from '@chakra-ui/react';
import React from 'react';

export function InputPageNumber({
  page,
  setPage,
}: {
  page: number;
  setPage: (page: number) => void;
}): React.ReactElement {
  return (
    <Tr>
      <Th width={60} fontSize="large">
        Page
      </Th>
      <Td>
        <NumberInput
          value={page}
          onChange={(pageNumberString) => setPage(parseInt(pageNumberString))}
          defaultValue={1}
          min={1}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Td>
    </Tr>
  );
}
