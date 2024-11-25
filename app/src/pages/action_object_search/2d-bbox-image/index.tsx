import { Box, ChakraProvider } from '@chakra-ui/react';
import { Pagination } from 'components/action_object_search/Pagination';
import {
  IMAGE_VIEWER_PAGE_KEY,
  IRI_KEY,
  IS_VIDEO_SEGMENT_KEY,
  MAIN_OBJECT_KEY,
  type SearchParamKey,
  TARGET_OBJECT_KEY,
} from 'constants/action_object_search/constants';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  type FrameQueryType,
  fetchFrameByCamera,
  fetchFrameByVideoSegment,
  fetchImage,
} from 'utils/action_object_search/2d-bbox-image/sparql';

function BoundingBoxImageViewer(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();

  const mainObject = searchParams.get(MAIN_OBJECT_KEY) || '';
  const targetObject = searchParams.get(TARGET_OBJECT_KEY) || '';
  const isVideoSegment = searchParams.get(IS_VIDEO_SEGMENT_KEY) === 'true';
  const iri = searchParams.get(IRI_KEY) || '';

  const [frames, setFrames] = useState<FrameQueryType[]>([]);
  const [imageViewerPage, setImageViewerPage] = useState(
    Number(searchParams.get(IMAGE_VIEWER_PAGE_KEY)) || 1
  );
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const [resolutionX, setResolutionX] = useState(0);
  const [resolutionY, setResolutionY] = useState(0);

  const anyRequiredParamIsEmpty = mainObject === '' || iri === '';
  const frameCount = frames.length;

  useEffect(() => {
    const canvas = document.getElementById('image') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    setCanvasContext(context);

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
      if (frameCount === 0) {
        return;
      }

      const splitImages = await fetchImage(
        frames[imageViewerPage - 1].frame.value
      );
      const [resX, resY] = splitImages[0].resolution.value.split('x');
      setResolutionX(Number(resX));
      setResolutionY(Number(resY));

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
  }, [frames, imageViewerPage]);

  const handleSearchParamsChange = useCallback(
    (key: SearchParamKey, value: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, value);
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  return (
    <ChakraProvider>
      <Box>
        <canvas
          width={`${resolutionX}px`}
          height={`${resolutionY}px`}
          id="image"
        />
        <Pagination
          pageState={imageViewerPage}
          setPageState={setImageViewerPage}
          pageKey={IMAGE_VIEWER_PAGE_KEY}
          handleSearchParamsChange={handleSearchParamsChange}
          totalElements={frameCount}
          totalElementsPerPage={1}
        />
      </Box>
    </ChakraProvider>
  );
}
export default BoundingBoxImageViewer;
