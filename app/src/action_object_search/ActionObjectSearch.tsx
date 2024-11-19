import {
  ChakraProvider,
  Flex,
  Table,
  TableContainer,
  Tbody,
} from '@chakra-ui/react';
import { InputObject } from 'action_object_search/components/InputObject';
import { Pagination } from 'action_object_search/components/Pagination';
import { SelectAction } from 'action_object_search/components/SelectAction';
import {
  VideoDurationRadio,
  type VideoDurationType,
} from 'action_object_search/components/VideoDurationRadio';
import { VideoGrid } from 'action_object_search/components/VideoGrid';
import {
  type SearchParamKey,
  type SearchParamObjectKey,
  MAIN_OBJECT_KEY,
  SEARCH_RESULT_PAGE_KEY,
  SELETED_ACTION_KEY,
  SELETED_VIDEO_DURATION_KEY,
  TARGET_OBJECT_KEY,
  TOTAL_VIDEOS_PER_PAGE,
} from 'action_object_search/constants';
import {
  type ActionQueryType,
  fetchAction,
  fetchVideo,
  fetchVideoCount,
  type VideoQueryType,
} from 'action_object_search/utils/sparql';
import FloatingNavigationLink from 'common/components/FloatingNavigationLink';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function ActionObjectSearch(): React.ReactElement {
  const [actions, setActions] = useState<ActionQueryType[]>([]);
  const [videos, setVideos] = useState<VideoQueryType[]>([]);
  const [videoCount, setVideoCount] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedAction, setSelectedAction] = useState<string>(
    searchParams.get(SELETED_ACTION_KEY) || ''
  );
  const [mainObject, setMainObject] = useState<string>(
    searchParams.get(MAIN_OBJECT_KEY) || ''
  );
  const [targetObject, setTargetObject] = useState<string>(
    searchParams.get(TARGET_OBJECT_KEY) || ''
  );
  const [selectedVideoDuration, setSelectedVideoDuration] =
    useState<VideoDurationType>(
      (searchParams.get(SELETED_VIDEO_DURATION_KEY) as VideoDurationType) ||
        'full'
    );
  const [searchResultPage, setSearchResultPage] = useState<number>(
    Number(searchParams.get(SEARCH_RESULT_PAGE_KEY)) || 1
  );

  const handleSearchParamsChange = useCallback(
    (key: SearchParamKey, value: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, value);
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

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
      if (selectedVideoDuration === 'full') {
        setVideos(
          await fetchVideo(
            selectedAction,
            mainObject,
            targetObject,
            TOTAL_VIDEOS_PER_PAGE,
            searchResultPage
          )
        );
      }
    })();
  }, [
    selectedAction,
    mainObject,
    targetObject,
    selectedVideoDuration,
    searchResultPage,
  ]);

  useEffect(() => {
    (async () => {
      if (selectedAction === '') {
        return;
      }
      if (mainObject === '') {
        return;
      }

      setVideoCount(
        await fetchVideoCount(selectedAction, mainObject, targetObject)
      );
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
                handleSearchParamsChange={handleSearchParamsChange}
              />
              <InputObject
                searchParamObjectKey={MAIN_OBJECT_KEY as SearchParamObjectKey}
                objectState={mainObject}
                setObjectState={setMainObject}
                handleSearchParamsChange={handleSearchParamsChange}
                tableHeader="Main Object"
                inputPlaceholder="Required"
              />
              <InputObject
                searchParamObjectKey={TARGET_OBJECT_KEY as SearchParamObjectKey}
                objectState={targetObject}
                setObjectState={setTargetObject}
                handleSearchParamsChange={handleSearchParamsChange}
                tableHeader="Target Object"
                inputPlaceholder="Optional"
              />
              <VideoDurationRadio
                selectedVideoDuration={selectedVideoDuration}
                setSelectedVideoDuration={setSelectedVideoDuration}
                handleSearchParamsChange={handleSearchParamsChange}
              />
            </Tbody>
          </Table>
        </TableContainer>
        <VideoGrid videos={videos} />
        <Pagination
          searchResultPage={searchResultPage}
          setSearchResultPage={setSearchResultPage}
          handleSearchParamsChange={handleSearchParamsChange}
          totalVideos={videoCount}
        />
      </Flex>
    </ChakraProvider>
  );
}
export default ActionObjectSearch;
