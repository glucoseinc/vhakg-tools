import React from 'react';
import { Input, Td, Th, Tr } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';

type InputObjectProps = {
  objectType: string;
  objectState: string;
  setObjectState: (objectState: string) => void;
  tableHeader: string;
  inputPlaceholder: string;
};
export function InputObject({
  objectType,
  objectState,
  setObjectState,
  tableHeader,
  inputPlaceholder,
}: InputObjectProps): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setObjectState(event.target.value);
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
            value={objectState}
            onChange={handleChange}
          />
        </Td>
      </Tr>
    </>
  );
}
