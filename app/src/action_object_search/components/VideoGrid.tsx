import { Grid, GridItem, Link } from '@chakra-ui/react';
import {
  type VideoSegmentQueryType,
  type VideoQueryType,
} from 'action_object_search/utils/sparql';
import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

function getVideoDurationAsMediaFragment(video: VideoSegmentQueryType) {
  const frameRate = Number(video.frameRate.value);
  const start = Math.floor(Number(video.startFrame.value) / frameRate);
  const end = Math.floor(Number(video.endFrame.value) / frameRate);
  return `#t=${start},${end}`;
}

type VideoGridProps = {
  videos: VideoQueryType[] | VideoSegmentQueryType[];
};
export function VideoGrid({ videos }: VideoGridProps): React.ReactElement {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      {videos.map((video) => {
        const isVideoSegment = 'videoSegment' in video;
        return (
          <GridItem
            key={isVideoSegment ? video.videoSegment.value : video.camera.value}
            p={2}
            border="1px"
            borderColor="gray.200"
            rounded="xl"
          >
            <video
              src={`data:video/mp4;base64,${video.base64Video.value}${isVideoSegment ? getVideoDurationAsMediaFragment(video) : ''}`}
              controls
              width="100%"
              height="auto"
            />
            <Link as={ReactRouterLink} to={``} state={{}}>
              {isVideoSegment
                ? video.videoSegment.value.split('/').pop()
                : video.camera.value.split('/').pop()}
            </Link>
          </GridItem>
        );
      })}
    </Grid>
  );
}
