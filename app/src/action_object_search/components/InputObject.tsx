import React from 'react';
import { Input, Td, Th, Tr } from '@chakra-ui/react';

export function InputObject({
  objectState,
  setObjectState,
  tableHeader,
  inputPlaceholder,
}: {
  objectState: string;
  setObjectState: (mainObject: string) => void;
  tableHeader: string;
  inputPlaceholder: string;
}): React.ReactElement {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setObjectState(event.target.value);
  };

  return (
    <>
      <Tr>
        <Th width={60} fontSize="large">
          {tableHeader}
        </Th>
        <Td>
          <Input
            placeholder={inputPlaceholder}
            value={objectState}
            onChange={handleChange}
          />
        </Td>
      </Tr>
    </>
  );
}
