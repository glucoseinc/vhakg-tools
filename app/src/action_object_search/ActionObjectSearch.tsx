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
import { ActionQueryType, fetchAction } from 'action_object_search/utils/sparql';

function ActionObjectSearch() {
  const [actions, setActions] = useState<ActionQueryType[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>('');

  useEffect(() => {
    (async () => {
      setActions(await fetchAction());
    })();
  }, []);

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
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </ChakraProvider>
  );
}
export default ActionObjectSearch;
