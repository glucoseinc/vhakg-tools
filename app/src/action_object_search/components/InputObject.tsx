import React from 'react';
import { Input, Td, Th, Tr } from '@chakra-ui/react';

type InputObjectProps = {
  objectType: string;
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
  tableHeader: string;
  inputPlaceholder: string;
};
export function InputObject({
  objectType,
  searchParams,
  setSearchParams,
  tableHeader,
  inputPlaceholder,
}: InputObjectProps): React.ReactElement {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    searchParams.set(objectType, event.target.value);
    setSearchParams(searchParams);
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
            value={searchParams.get(objectType) || ''}
            onChange={handleChange}
          />
        </Td>
      </Tr>
    </>
  );
}
