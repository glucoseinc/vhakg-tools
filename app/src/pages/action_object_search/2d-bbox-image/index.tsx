import { Box, ChakraProvider } from '@chakra-ui/react';
import { Pagination } from 'components/action_object_search/Pagination';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  type FrameQueryType,
  ImageQueryType,
  fetchFrameByCamera,
  fetchFrameByVideoSegment,
  fetchImage,
} from 'utils/action_object_search/2d-bbox-image/sparql';

function BoundingBoxImageViewer(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const mainObject = searchParams.get('mainObject') || '';
  const targetObject = searchParams.get('targetObject') || '';
  const isVideoSegment = searchParams.get('isVideoSegment') === 'true';
  const iri = searchParams.get('iri') || '';

  const [frames, setFrames] = useState<FrameQueryType[]>([]);
  const [imagePage, setImagePage] = useState(1);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const [resolutionX, setResolutionX] = useState(0);
  const [resolutionY, setResolutionY] = useState(0);

  const anyRequiredParamIsEmpty = mainObject === '' || iri === '';
  const frameCount = frames.length;

  useEffect(() => {
    const canvas = document.getElementById('resultImage') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    setCanvasContext(context);
  }, []);

  useEffect(() => {
    (async () => {
      if (anyRequiredParamIsEmpty) {
        return;
      }

      if (isVideoSegment) {
        setFrames(
          await fetchFrameByVideoSegment(iri, mainObject, targetObject)
        );
      } else {
        setFrames(await fetchFrameByCamera(iri, mainObject, targetObject));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (frames.length === 0) {
        return;
      }

      const splitImages = await fetchImage(frames[imagePage - 1].frame.value);
      setResolutionX(Number(splitImages[0].resolution.value.split('x')[0]));
      setResolutionY(Number(splitImages[0].resolution.value.split('x')[1]));

      splitImages.forEach((image, index) => {
        const img = new Image();
        img.src = `data:image/jpeg;base64,${image.base64SplitImage.value}`;
        img.onload = () => {
          const x = (index % Number(image.splitWidth.value)) * img.width;
          const y =
            Math.floor(index / Number(image.splitHeight.value)) * img.height;
          canvasContext?.drawImage(img, x, y);
        };
      });
    })();
  }, [frames, imagePage]);

  return (
    <ChakraProvider>
      <Box>
        <canvas
          width={`${resolutionX}px`}
          height={`${resolutionY}px`}
          id="resultImage"
        />
        <Pagination
          searchResultPage={imagePage}
          setSearchResultPage={setImagePage}
          handleSearchParamsChange={() => {}}
          totalVideos={frameCount}
          totalDisplayablePages={10}
        />
      </Box>
    </ChakraProvider>
  );
}
export default BoundingBoxImageViewer;
