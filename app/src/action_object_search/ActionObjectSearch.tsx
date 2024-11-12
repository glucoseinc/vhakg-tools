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
  fetchVideo,
  VideoQueryType,
} from 'action_object_search/utils/sparql';
import { InputObject } from 'action_object_search/components/InputObject';
import {
  VideoDurationRadio,
  VideoDurationType,
} from 'action_object_search/components/VideoDurationRadio';
import { VideoGrid } from 'action_object_search/components/VideoGrid';
import { InputPageNumber } from 'action_object_search/components/InputPageNumber';

function ActionObjectSearch(): React.ReactElement {
  const [actions, setActions] = useState<ActionQueryType[]>([]);
  const [mainObject, setMainObject] = useState<string>('');
  const [targetObject, setTargetObject] = useState<string>('');
  const [videos, setVideos] = useState<VideoQueryType[]>([]);
  const [page, setPage] = useState<number>(1);

  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedVideoDuration, setSelectedVideoDuration] =
    useState<VideoDurationType>('full');

  const TOTAL_VIDEOS_PER_PAGE = 9;

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
    if (isNaN(page)) {
      return;
    }

    (async () => {
      if (selectedVideoDuration === 'full') {
        setVideos(
          await fetchVideo(
            selectedAction,
            mainObject,
            targetObject,
            TOTAL_VIDEOS_PER_PAGE,
            page
          )
        );
      }
    })();
  }, [selectedAction, mainObject, targetObject, selectedVideoDuration, page]);

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
              <VideoDurationRadio
                selectedVideoDuration={selectedVideoDuration}
                setSelectedVideoDuration={setSelectedVideoDuration}
              />
              <InputPageNumber page={page} setPage={setPage} />
            </Tbody>
          </Table>
        </TableContainer>
        <VideoGrid videos={videos} />
      </Flex>
    </ChakraProvider>
  );
}
export default ActionObjectSearch;
