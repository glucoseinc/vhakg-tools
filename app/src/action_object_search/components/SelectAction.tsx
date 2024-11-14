import React from 'react';
import { Select, Td, Th, Tr } from '@chakra-ui/react';
import { ActionQueryType } from 'action_object_search/utils/sparql';

type SelectActionProps = {
  actions: ActionQueryType[];
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
};
export function SelectAction({
  actions,
  searchParams,
  setSearchParams,
}: SelectActionProps): React.ReactElement {
  const options = actions.map((action) => ({
    value: action.action.value,
    label: action.action.value.split('/').pop(), // vh2kg:action/<Action>から<Action>を取得
  }));

  return (
    <>
      <Tr>
        <Th width={60} fontSize="large">
          Action
        </Th>
        <Td>
          <Select
            placeholder="select"
            value={searchParams.get('action') || ''}
            onChange={(e) => {
              const action = e.target.value;
              searchParams.set('action', action);
              setSearchParams(searchParams);
            }}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Td>
      </Tr>
    </>
  );
}
