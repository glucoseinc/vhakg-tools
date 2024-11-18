import React, { useCallback } from 'react';
import { Radio, RadioGroup, Stack, Td, Th, Tr } from '@chakra-ui/react';
import {
  SearchParamKey,
  selectedVideoDurationKey,
} from 'action_object_search/constants';

export type VideoDurationType = 'full' | 'segment';
type VideoDurationRadioProps = {
  selectedVideoDuration: VideoDurationType;
  setSelectedVideoDuration: (videoDuration: VideoDurationType) => void;
  handleSearchParamsChange: (key: SearchParamKey, value: string) => void;
};
export function VideoDurationRadio({
  selectedVideoDuration,
  setSelectedVideoDuration,
  handleSearchParamsChange,
}: VideoDurationRadioProps): React.ReactElement {
  const handleChange = useCallback(
    (value: VideoDurationType) => {
      setSelectedVideoDuration(value);
      handleSearchParamsChange(selectedVideoDurationKey, value);
    },
    [setSelectedVideoDuration, handleSearchParamsChange]
  );

  return (
    <>
      <Tr>
        <Th width={60} fontSize="large">
          Video Duration
        </Th>
        <Td>
          <RadioGroup onChange={handleChange} value={selectedVideoDuration}>
            <Stack direction="row">
              <Radio value="full">Full</Radio>
              <Radio value="segment">Segment</Radio>
            </Stack>
          </RadioGroup>
        </Td>
      </Tr>
    </>
  );
}
