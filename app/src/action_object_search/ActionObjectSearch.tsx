import {
  ChakraProvider,
  Flex,
  Table,
  TableContainer,
  Tbody,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { SelectAction } from 'action_object_search/components/SelectAction';
import FloatingNavigationLink from 'common/components/FloatingNavigationLink';
import {
  ActionQueryType,
  fetchAction,
  fetchEvent,
} from 'action_object_search/utils/sparql';
import { InputObject } from 'action_object_search/components/InputObject';
import { EventQueryType } from 'action_object_search/utils/sparql';

function ActionObjectSearch(): React.ReactElement {
  const [actions, setActions] = useState<ActionQueryType[]>([]);
  const [events, setEvents] = useState<EventQueryType[]>([]);
  const [mainObject, setMainObject] = useState<string>('');
  const [targetObject, setTargetObject] = useState<string>('');

  const [selectedAction, setSelectedAction] = useState<string>('');

  useEffect(() => {
    (async () => {
      setActions(await fetchAction());
    })();
  }, []);

  useEffect(() => {
    if (selectedAction === '') {
      return;
    }
    if (mainObject === '') {
      return;
    }
    (async () => {
      setEvents(await fetchEvent(selectedAction, mainObject, targetObject));
    })();
  }, [selectedAction, mainObject, targetObject]);

  return (
    <ChakraProvider>
      <FloatingNavigationLink linkTo="/" buttonText="Home" />
      <Flex flexDirection="column" width="1000px" mx="auto" gap={4}>
        <TableContainer>
          <Table>
            <Tbody>
              <SelectAction
                actions={actions}
                selectedAction={selectedAction}
                setSelectedAction={setSelectedAction}
              />
              <InputObject
                objectState={mainObject}
                setObjectState={setMainObject}
                tableHeader="Main Object"
                inputPlaceholder="Required"
              />
              <InputObject
                objectState={targetObject}
                setObjectState={setTargetObject}
                tableHeader="Target Object"
                inputPlaceholder="Optional"
              />
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </ChakraProvider>
  );
}
export default ActionObjectSearch;
