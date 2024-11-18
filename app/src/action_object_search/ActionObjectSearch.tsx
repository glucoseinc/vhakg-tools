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

export type SearchParamObjectKey = 'mainObject' | 'targetObject';
type SearchParamKey =
  | 'selectedAction'
  | 'selectedVideoDuration'
  | 'searchResultPage'
  | SearchParamObjectKey;

export const selectedActionKey: SearchParamKey = 'selectedAction';
export const mainObjectKey: SearchParamKey = 'mainObject';
export const targetObjectKey: SearchParamKey = 'targetObject';
export const selectedVideoDurationKey: SearchParamKey = 'selectedVideoDuration';
export const searchResultPageKey: SearchParamKey = 'searchResultPage';

function ActionObjectSearch(): React.ReactElement {
  const [actions, setActions] = useState<ActionQueryType[]>([]);
  const [videos, setVideos] = useState<VideoQueryType[]>([]);
  const [videoCount, setVideoCount] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedAction, setSelectedAction] = useState<string>(
    searchParams.get(selectedActionKey) || ''
  );
  const [mainObject, setMainObject] = useState<string>(
    searchParams.get(mainObjectKey) || ''
  );
  const [targetObject, setTargetObject] = useState<string>(
    searchParams.get(targetObjectKey) || ''
  );
  const [selectedVideoDuration, setSelectedVideoDuration] =
    useState<VideoDurationType>(
      (searchParams.get(selectedVideoDurationKey) as VideoDurationType) ||
        'full'
    );
  const [searchResultPage, setSearchResultPage] = useState<number>(
    Number(searchParams.get(searchResultPageKey)) || 1
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

  useMemo(() => {
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
  }, [selectedAction, mainObject, targetObject, selectedVideoDuration]);

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
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                setSelectedAction={setSelectedAction}
              />
              <InputObject
                searchParamObjectKey={mainObjectKey as SearchParamObjectKey}
                objectState={mainObject}
                setObjectState={setMainObject}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                tableHeader="Main Object"
                inputPlaceholder="Required"
              />
              <InputObject
                searchParamObjectKey={targetObjectKey as SearchParamObjectKey}
                objectState={targetObject}
                setObjectState={setTargetObject}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                tableHeader="Target Object"
                inputPlaceholder="Optional"
              />
              <VideoDurationRadio
                selectedVideoDuration={selectedVideoDuration}
                setSelectedVideoDuration={setSelectedVideoDuration}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            </Tbody>
          </Table>
        </TableContainer>
        <VideoGrid videos={videos} />
        <Pagination
          searchResultPage={searchResultPage}
          setSearchResultPage={setSearchResultPage}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          totalVideos={videoCount}
        />
      </Flex>
    </ChakraProvider>
  );
}
export default ActionObjectSearch;
