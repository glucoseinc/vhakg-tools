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
  fetchVideoCount,
  VideoQueryType,
} from 'action_object_search/utils/sparql';
import { InputObject } from 'action_object_search/components/InputObject';
import { VideoDurationRadio } from 'action_object_search/components/VideoDurationRadio';
import { VideoGrid } from 'action_object_search/components/VideoGrid';
import { TOTAL_VIDEOS_PER_PAGE } from 'action_object_search/constants';
import { Pagination } from 'action_object_search/components/Pagination';
import { useSearchParams } from 'react-router-dom';

function ActionObjectSearch(): React.ReactElement {
  const [actions, setActions] = useState<ActionQueryType[]>([]);
  const [videos, setVideos] = useState<VideoQueryType[]>([]);
  const [videoCount, setVideoCount] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    (async () => {
      setActions(await fetchAction());
    })();
  }, []);

  useEffect(() => {
    if (!searchParams.get('action')) {
      return;
    }
    if (!searchParams.get('mainObject')) {
      return;
    }

    (async () => {
      if (searchParams.get('videoDuration') === 'full') {
        setVideos(
          await fetchVideo(
            searchParams.get('action') as string,
            searchParams.get('mainObject') as string,
            searchParams.get('targetObject') || '',
            TOTAL_VIDEOS_PER_PAGE,
            Number(searchParams.get('searchResultPage')) || 1
          )
        );
        setVideoCount(
          await fetchVideoCount(selectedAction, mainObject, targetObject)
        );
      }
    })();
  }, [searchParams]);

  return (
    <ChakraProvider>
      <FloatingNavigationLink linkTo="/" buttonText="Home" />
      <Flex flexDirection="column" width="1000px" mx="auto" gap={4}>
        <TableContainer>
          <Table>
            <Tbody>
              <SelectAction
                actions={actions}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
              <InputObject
                objectType="mainObject"
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                tableHeader="Main Object"
                inputPlaceholder="Required"
              />
              <InputObject
                objectType="targetObject"
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                tableHeader="Target Object"
                inputPlaceholder="Optional"
              />
              <VideoDurationRadio
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            </Tbody>
          </Table>
        </TableContainer>
        <VideoGrid videos={videos} />
        <Pagination
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          totalVideos={videoCount}
        />
      </Flex>
    </ChakraProvider>
  );
}
export default ActionObjectSearch;
