import {
  ChakraProvider,
  Flex,
  Table,
  TableContainer,
  Tbody,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
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
import {
  VideoDurationRadio,
  VideoDurationType,
} from 'action_object_search/components/VideoDurationRadio';
import { VideoGrid } from 'action_object_search/components/VideoGrid';
import { TOTAL_VIDEOS_PER_PAGE } from 'action_object_search/constants';
import { Pagination } from 'action_object_search/components/Pagination';
import { useSearchParams } from 'react-router-dom';

function ActionObjectSearch(): React.ReactElement {
  const [actions, setActions] = useState<ActionQueryType[]>([]);
  const [videos, setVideos] = useState<VideoQueryType[]>([]);
  const [videoCount, setVideoCount] = useState<number>(0);

  const [searchParams] = useSearchParams();

  const [action, setAction] = useState<string>(
    searchParams.get('action') || ''
  );
  const [mainObject, setMainObject] = useState<string>(
    searchParams.get('mainObject') || ''
  );
  const [targetObject, setTargetObject] = useState<string>(
    searchParams.get('targetObject') || ''
  );
  const [videoDuration, setVideoDuration] = useState<VideoDurationType>(
    (searchParams.get('videoDuration') as VideoDurationType) || 'full'
  );
  const [searchResultPage, setSearchResultPage] = useState<number>(
    Number(searchParams.get('searchResultPage')) || 1
  );

  useEffect(() => {
    (async () => {
      setActions(await fetchAction());
    })();
  }, []);

  useEffect(() => {
    if (action === '') {
      return;
    }
    if (mainObject === '') {
      return;
    }

    (async () => {
      if (videoDuration === 'full') {
        setVideos(
          await fetchVideo(
            action,
            mainObject,
            targetObject,
            TOTAL_VIDEOS_PER_PAGE,
            searchResultPage
          )
        );
      }
    })();
  }, [action, mainObject, targetObject, videoDuration, searchResultPage]);

  useMemo(() => {
    (async () => {
      if (action === '') {
        return;
      }
      if (mainObject === '') {
        return;
      }

      setVideoCount(await fetchVideoCount(action, mainObject, targetObject));
    })();
  }, [action, mainObject, targetObject, videoDuration]);

  return (
    <ChakraProvider>
      <FloatingNavigationLink linkTo="/" buttonText="Home" />
      <Flex flexDirection="column" width="1000px" mx="auto" gap={4}>
        <TableContainer>
          <Table>
            <Tbody>
              <SelectAction
                actions={actions}
                action={action}
                setAction={setAction}
              />
              <InputObject
                objectType="mainObject"
                objectState={mainObject}
                setObjectState={setMainObject}
                tableHeader="Main Object"
                inputPlaceholder="Required"
              />
              <InputObject
                objectType="targetObject"
                objectState={targetObject}
                setObjectState={setTargetObject}
                tableHeader="Target Object"
                inputPlaceholder="Optional"
              />
              <VideoDurationRadio
                videoDuration={videoDuration}
                setVideoDuration={setVideoDuration}
              />
            </Tbody>
          </Table>
        </TableContainer>
        <VideoGrid videos={videos} />
        <Pagination
          searchResultPage={searchResultPage}
          setSearchResultPage={setSearchResultPage}
          totalVideos={videoCount}
        />
      </Flex>
    </ChakraProvider>
  );
}
export default ActionObjectSearch;
