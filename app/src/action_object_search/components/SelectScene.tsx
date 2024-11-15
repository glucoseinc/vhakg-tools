import React from 'react';
import { Select, Td, Th, Tr } from '@chakra-ui/react';
import { SceneQueryType } from 'action_object_search/utils/sparql';

type SelectSceneProps = {
  scenes: SceneQueryType[];
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
};
export function SelectScene({
  scenes,
  searchParams,
  setSearchParams,
}: SelectSceneProps): React.ReactElement {
  const options = new Set(
    scenes
      .map((scene) => scene.scene.value.split('_').pop())
      .filter((scene) => scene !== undefined)
  );
  return (
    <>
      <Tr>
        <Th width={60} fontSize="large">
          Scene
        </Th>
        <Td>
          <Select
            placeholder="select"
            value={searchParams.get('scene') || ''}
            onChange={(e) => {
              const scene = e.target.value;
              searchParams.set('scene', scene);
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
