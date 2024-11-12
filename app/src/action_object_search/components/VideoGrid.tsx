import { Grid, GridItem, Text } from '@chakra-ui/react';
import { VideoQueryType } from 'action_object_search/utils/sparql';
import { Link } from 'react-router-dom';

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
          <video
            src={`data:video/mp4;base64,${video.base64Video.value}`}
            controls
            width="100%"
            height="auto"
          />
          <Link to={``} state={{}}>
            {/* stateを使用するためにreact-router-domのLink要素を使用 */}
            <Text
              fontSize="sm"
              color="gray.600"
              align="center"
              mt="2"
              _hover={{ textDecoration: 'underline' }}
            >
              {video.camera.value.split('/').pop()}
            </Text>
          </Link>
        </GridItem>
      ))}
    </Grid>
  );
}
