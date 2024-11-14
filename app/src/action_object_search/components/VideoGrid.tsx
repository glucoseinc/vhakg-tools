import { Grid, GridItem, Link } from '@chakra-ui/react';
import { VideoQueryType } from 'action_object_search/utils/sparql';
import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

type VideoGridProps = {
  videos: VideoQueryType[];
};
export function VideoGrid({ videos }: VideoGridProps): React.ReactElement {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      {videos.map((video) => (
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
