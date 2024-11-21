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

type VideoGridProps =
  | {
      videos: VideoQueryType[];
    }
  | {
      videos: VideoSegmentQueryType[];
      isSegment: boolean;
    };
export function VideoGrid(props: VideoGridProps): React.ReactElement {
  if ('isSegment' in props) {
    return (
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        {props.videos.map((video) => (
          <GridItem
            key={video.videoSegment.value}
            p={2}
            border="1px"
            borderColor="gray.200"
            rounded="xl"
          >
            <video
              src={`data:video/mp4;base64,${video.base64Video.value}${getVideoDurationAsMediaFragment(video)}`}
              controls
              width="100%"
              height="auto"
            />
            <Link as={ReactRouterLink} to={``} state={{}}>
              {video.videoSegment.value.split('/').pop()}
            </Link>
          </GridItem>
        ))}
      </Grid>
    );
  } else {
    return (
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        {props.videos.map((video) => (
          <GridItem
            key={video.camera.value}
            p={2}
            border="1px"
            borderColor="gray.200"
            rounded="xl"
          >
            <video
              src={`data:video/mp4;base64,${video.base64Video.value}`}
              controls
              width="100%"
              height="auto"
            />
            <Link as={ReactRouterLink} to={``} state={{}}>
              {video.camera.value.split('/').pop()}
            </Link>
          </GridItem>
        ))}
      </Grid>
    );
  }
}
