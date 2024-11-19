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
  ACTION_KEY,
  VIDEO_DURATION_KEY,
  TARGET_OBJECT_KEY,
  TOTAL_VIDEOS_PER_PAGE,
  SCENE_KEY,
  CAMERA_KEY,
} from 'action_object_search/constants';
import {
  type ActionQueryType,
  type CameraQueryType,
  fetchAction,
  fetchScene,
  fetchVideo,
  fetchVideoCount,
  type SceneQueryType,
  type VideoQueryType,
} from 'action_object_search/utils/sparql';
import FloatingNavigationLink from 'common/components/FloatingNavigationLink';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SelectScene } from 'action_object_search/components/SelectScene';
import { SelectCamera } from 'action_object_search/components/SelectCamera';
import { fetchCamera } from 'action_object_search/utils/sparql';

function ActionObjectSearch(): React.ReactElement {
  const [actions, setActions] = useState<ActionQueryType[]>([]);
  const [videos, setVideos] = useState<VideoQueryType[]>([]);
  const [videoCount, setVideoCount] = useState<number>(0);
  const [scenes, setScenes] = useState<SceneQueryType[]>([]);
  const [cameras, setCameras] = useState<CameraQueryType[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedAction, setSelectedAction] = useState<string>(
    searchParams.get(ACTION_KEY) || ''
  );
  const [mainObject, setMainObject] = useState<string>(
    searchParams.get(MAIN_OBJECT_KEY) || ''
  );
  const [targetObject, setTargetObject] = useState<string>(
    searchParams.get(TARGET_OBJECT_KEY) || ''
  );
  const [selectedVideoDuration, setSelectedVideoDuration] =
    useState<VideoDurationType>(
      (searchParams.get(VIDEO_DURATION_KEY) as VideoDurationType) || 'full'
    );
  const [searchResultPage, setSearchResultPage] = useState<number>(
    Number(searchParams.get(SEARCH_RESULT_PAGE_KEY)) || 1
  );
  const [selectedScene, setSelectedScene] = useState<string>(
    searchParams.get(SCENE_KEY) || ''
  );
  const [selectedCamera, setSelectedCamera] = useState<string>(
    searchParams.get(CAMERA_KEY) || ''
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
            selectedScene,
            selectedCamera,
            TOTAL_VIDEOS_PER_PAGE,
            searchResultPage
          )
        );
        setScenes(
          await fetchScene(
            selectedAction,
            mainObject,
            targetObject,
            selectedCamera
          )
        );
        setCameras(
          await fetchCamera(
            selectedAction,
            mainObject,
            targetObject,
            selectedScene
          )
        );
      }
    })();
  }, [
    selectedAction,
    mainObject,
    targetObject,
    selectedScene,
    selectedCamera,
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
        await fetchVideoCount(
          selectedAction,
          mainObject,
          targetObject,
          selectedScene,
          selectedCamera
        )
      );
    })();
  }, [selectedAction, mainObject, targetObject, selectedScene, selectedCamera]);

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
              <SelectScene
                scenes={scenes}
                selectedScene={selectedScene}
                setSelectedScene={setSelectedScene}
                handleSearchParamsChange={handleSearchParamsChange}
              />
              <SelectCamera
                cameras={cameras}
                selectedCamera={selectedCamera}
                setSelectedCamera={setSelectedCamera}
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
