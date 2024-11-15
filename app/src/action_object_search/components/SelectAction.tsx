import React from 'react';
import { Select, Td, Th, Tr } from '@chakra-ui/react';
import { ActionQueryType } from 'action_object_search/utils/sparql';
import { useSearchParams } from 'react-router-dom';

type SelectActionProps = {
  actions: ActionQueryType[];
  action: string;
  setAction: (action: string) => void;
};
export function SelectAction({
  actions,
  action,
  setAction,
}: SelectActionProps): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();

  const options = actions.map((action) => ({
    value: action.action.value,
    label: action.action.value.split('/').pop(), // vh2kg:action/<Action>から<Action>を取得
  }));

  const handleChange = (value: string) => {
    setAction(value);
    searchParams.set('action', value);
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
            value={action}
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
