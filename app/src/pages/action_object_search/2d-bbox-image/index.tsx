import { Box, Center, ChakraProvider } from '@chakra-ui/react';
import { BackToVideoSearchButton } from 'components/action_object_search/2d-bbox-image/BackToVideoSearchButton';
import { Pagination } from 'components/action_object_search/Pagination';
import {
  IMAGE_VIEWER_PAGE_KEY,
  IRI_KEY,
  MAIN_OBJECT_KEY,
  type SearchParamKey,
  TARGET_OBJECT_KEY,
  TOTAL_IMAGES_PER_PAGE,
} from 'constants/action_object_search/constants';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  type FrameQueryType,
  fetchBoundingBox,
  fetchFrameByCamera,
  fetchFrameByVideoSegment,
  fetchImage,
} from 'utils/action_object_search/2d-bbox-image/sparql';

function BoundingBoxImageViewer(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();

  const mainObject = searchParams.get(MAIN_OBJECT_KEY) || '';
  const targetObject = searchParams.get(TARGET_OBJECT_KEY) || '';
  const iri = searchParams.get(IRI_KEY) || '';

  const [frames, setFrames] = useState<FrameQueryType[]>([]);
  const [imageViewerPage, setImageViewerPage] = useState(
    Number(searchParams.get(IMAGE_VIEWER_PAGE_KEY)) || 1
  );
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const [resolution, setResolution] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const isAnyRequiredParamEmpty = mainObject === '' || iri === '';
  const isVideoSegment = iri.includes('video_segment');
  const frameCount = frames.length;

  useEffect(() => {
    const canvas = document.getElementById('image') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    setCanvasContext(context);

    (async () => {
      if (isAnyRequiredParamEmpty) {
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
      if (canvasContext === null) {
        return;
      }

      const frameIri = frames[imageViewerPage - 1].frame.value;

      const splitImages = await fetchImage(frameIri);

      const [imageWidth, imageHeight] = splitImages[0].resolution.value
        .split('x')
        .map((v) => Number(v)); // "1920x1080" -> [1920, 1080]
      setResolution({ width: imageWidth, height: imageHeight });

      splitImages.forEach((image, index) => {
        const img = new Image();
        img.src = `data:image/jpeg;base64,${image.base64SplitImage.value}`;
        img.onload = () => {
          const x = (index % Number(image.splitWidth.value)) * img.width;
          const y =
            Math.floor(index / Number(image.splitHeight.value)) * img.height;
          canvasContext.drawImage(img, x, y);
        };
      });

      const boundingBoxes = await fetchBoundingBox(
        frameIri,
        mainObject,
        targetObject
      );

      boundingBoxes.forEach((boundingBox) => {
        const [leftX, topY, rightX, bottomY] =
          boundingBox.boundingBoxValue.value.split(',').map((v) => Number(v));
        boundingBox.label.value.includes(mainObject)
          ? (canvasContext.strokeStyle = 'red')
          : (canvasContext.strokeStyle = 'blue');
        canvasContext?.strokeRect(
          leftX,
          imageHeight - topY, // Y軸はRDFとcanvasで上下が逆
          rightX - leftX,
          topY - bottomY
        );
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
      <Center>
        <Box>
          <Center>
            <canvas
              width={`${resolution.width}px`}
              height={`${resolution.height}px`}
              id="image"
            />
          </Center>
          <Pagination
            pageState={imageViewerPage}
            setPageState={setImageViewerPage}
            searchParamPageKey={IMAGE_VIEWER_PAGE_KEY}
            handleSearchParamsChange={handleSearchParamsChange}
            totalElements={frameCount}
            displayedElementsPerPage={TOTAL_IMAGES_PER_PAGE}
          />
          <BackToVideoSearchButton />
        </Box>
      </Center>
    </ChakraProvider>
  );
}
export default BoundingBoxImageViewer;
