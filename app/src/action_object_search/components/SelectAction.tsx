import React from 'react';
import { Select, Td, Th, Tr } from '@chakra-ui/react';
import { ActionQueryType } from 'action_object_search/utils/sparql';
import { selectedActionKey } from 'action_object_search/ActionObjectSearch';

type SelectActionProps = {
  actions: ActionQueryType[];
  selectedAction: string;
  setSelectedAction: (action: string) => void;
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
};
export function SelectAction({
  actions,
  selectedAction,
  setSelectedAction,
  searchParams,
  setSearchParams,
}: SelectActionProps): React.ReactElement {
  const options = actions.map((action) => ({
    value: action.action.value,
    label: action.action.value.split('/').pop(), // vh2kg:action/<Action>から<Action>を取得
  }));

  const handleChange = (value: string) => {
    setSelectedAction(value);
    searchParams.set(selectedActionKey, value);
    setSearchParams(searchParams);
  };

  return (
    <>
      <Tr>
        <Th width={60} fontSize="large">
          Action
        </Th>
        <Td>
          <Select
            placeholder="select"
            value={selectedAction}
            onChange={(e) => {
              handleChange(e.target.value);
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
