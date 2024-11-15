import React from 'react';
import { Select, Td, Th, Tr } from '@chakra-ui/react';
import { CameraQueryType } from 'action_object_search/utils/sparql';

type SelectCameraProps = {
  cameras: CameraQueryType[];
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
};
export function SelectCamera({
  cameras,
  searchParams,
  setSearchParams,
}: SelectCameraProps): React.ReactElement {
  const options = new Set(
    cameras
      .map((camera) => camera.camera.value.split('_').pop())
      .filter((camera) => camera !== undefined)
  );
  return (
    <>
      <Tr>
        <Th width={60} fontSize="large">
          Camera
        </Th>
        <Td>
          <Select
            placeholder="select"
            value={searchParams.get('camera') || ''}
            onChange={(e) => {
              const camera = e.target.value;
              searchParams.set('camera', camera);
              setSearchParams(searchParams);
            }}
          >
            {Array.from(options).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Td>
      </Tr>
    </>
  );
}
