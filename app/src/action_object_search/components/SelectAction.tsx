import React from 'react';
import { Select, Td, Th, Tr } from '@chakra-ui/react';
import { ActionQueryType } from 'action_object_search/utils/sparql';

export function SelectAction({
  actions,
  selectedAction,
  setSelectedAction,
}: {
  actions: ActionQueryType[];
  selectedAction: string;
  setSelectedAction: (action: string) => void;
}): React.ReactElement {
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
            value={selectedAction}
            onChange={(e) => {
              const action = e.target.value;
              setSelectedAction(action);
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
