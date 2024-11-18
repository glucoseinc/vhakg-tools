import React from 'react';
import { Input, Td, Th, Tr } from '@chakra-ui/react';
import { SearchParamObjectKey } from 'action_object_search/ActionObjectSearch';

type InputObjectProps = {
  searchParamObjectKey: SearchParamObjectKey;
  objectState: string;
  setObjectState: (objectState: string) => void;
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
  tableHeader: string;
  inputPlaceholder: string;
};
export function InputObject({
  searchParamObjectKey,
  objectState,
  setObjectState,
  searchParams,
  setSearchParams,
  tableHeader,
  inputPlaceholder,
}: InputObjectProps): React.ReactElement {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setObjectState(event.target.value);
    searchParams.set(searchParamObjectKey, event.target.value);
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
            value={objectState}
            onChange={handleChange}
          />
        </Td>
      </Tr>
    </>
  );
}
