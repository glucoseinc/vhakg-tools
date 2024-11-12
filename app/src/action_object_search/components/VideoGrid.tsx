import { Grid, GridItem, Text } from '@chakra-ui/react';
import { VideoQueryType } from 'action_object_search/utils/sparql';

export function VideoGrid({
  videos,
}: {
  videos: VideoQueryType[];
}): React.ReactElement {
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
          <Text fontSize="sm" color="gray.600" align="center" mb={2}>
            {video.camera.value.split('/').pop()}
          </Text>
          <video
            src={`data:video/mp4;base64,${video.base64Video.value}`}
            controls
            width="100%"
            height="auto"
            onClick={(e) => {
              e.preventDefault();
              // TODO: 2D Bounding Boxを表示する
            }}
          />
        </GridItem>
      ))}
    </Grid>
  );
}
