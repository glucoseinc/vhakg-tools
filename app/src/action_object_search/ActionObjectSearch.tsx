import React, { useEffect, useState } from 'react';
import '../root/App.css';
import {
  ChakraProvider,
  Flex,
  Table,
  TableContainer,
  Tbody,
} from '@chakra-ui/react';
import { PREFIXES, fetchActivity } from '../root/utils/sparql';
import { SelectActivity } from '../root/components/SelectActivity';
import { SelectScene } from '../root/components/SelectScene';
import { SelectCamera } from '../root/components/SelectCamera';
import { SelectMedia } from '../root/components/SelectMedia';
import { ResultVideo } from '../root/components/ResultVideo';
import { ResultImage } from '../root/components/ResultImage';
import FloatingNavigationLink from '../common/components/FloatingNavigationLink';

function ActionObjectSearch() {
  const [activityList, setActivityList] = useState<Map<string, string[]>>(
    new Map<string, string[]>()
  );
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedScene, setSelectedScene] = useState<string>('');
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMedia, setSelectedMedia] = useState<string>('');
  const [frame, setFrame] = useState<number>(0);

  const onChangeFrame = (frame: number, media: string) => {
    let innerFrame = frame;
    if (media === 'image') {
      // 余りが1だったら切り捨て、それ以外は切り上げしていそう
      if (frame % 5 === 1) {
        innerFrame = frame - 1;
      } else {
        innerFrame = Math.ceil(frame / 5) * 5;
      }
    }
    setFrame(innerFrame);
  };

  useEffect(() => {
    (async () => {
      const map = new Map<string, string[]>();
      const data = await fetchActivity();
      data.forEach((value) => {
        const activity = value.activity.value.replace(PREFIXES.ex, '');
        const splitActivity = activity.split('_scene');
        const activityName = splitActivity[0];
        const sceneName = 'scene' + splitActivity[1];
        if (map.has(activityName)) {
          map.get(activityName)?.push(sceneName);
        } else {
          map.set(activityName, [sceneName]);
        }
      });
      setActivityList(map);
    })();
  }, []);

  return (
    <ChakraProvider>
      <FloatingNavigationLink linkTo="/" buttonText="Home" />
      <Flex flexDirection="column" width="1000px" mx="auto" gap={4}>
        <TableContainer>
          <Table>
            <Tbody>
              <SelectActivity
                activityList={activityList}
                selectedActivity={selectedActivity}
                setSelectedActivity={setSelectedActivity}
              />
              {selectedActivity && (
                <SelectScene
                  activityList={activityList}
                  selectedActivity={selectedActivity}
                  selectedScene={selectedScene}
                  setSelectedScene={setSelectedScene}
                />
              )}
              {selectedScene && (
                <SelectCamera
                  selectedActivity={selectedActivity}
                  selectedScene={selectedScene}
                  selectedCamera={selectedCamera}
                  setSelectedCamera={setSelectedCamera}
                />
              )}
              {selectedCamera && (
                <SelectMedia
                  selectedActivity={selectedActivity}
                  selectedScene={selectedScene}
                  selectedCamera={selectedCamera}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  frame={frame}
                  setFrame={onChangeFrame}
                />
              )}
            </Tbody>
          </Table>
        </TableContainer>
        {selectedMedia === 'video' && (
          <ResultVideo
            selectedActivity={selectedActivity}
            selectedScene={selectedScene}
            selectedCamera={selectedCamera}
            frame={frame}
          />
        )}
        {selectedMedia === 'image' && (
          <ResultImage
            selectedActivity={selectedActivity}
            selectedScene={selectedScene}
            selectedCamera={selectedCamera}
            frame={frame}
          />
        )}
      </Flex>
    </ChakraProvider>
  );
}

export default ActionObjectSearch;
