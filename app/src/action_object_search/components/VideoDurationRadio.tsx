import React from 'react';
import { Radio, RadioGroup, Stack, Td, Th, Tr } from '@chakra-ui/react';
import { selectedVideoDurationKey } from 'action_object_search/ActionObjectSearch';

export type VideoDurationType = 'full' | 'segment';
type VideoDurationRadioProps = {
  selectedVideoDuration: VideoDurationType;
  setSelectedVideoDuration: (videoDuration: VideoDurationType) => void;
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
};
export function VideoDurationRadio({
  selectedVideoDuration,
  setSelectedVideoDuration,
  searchParams,
  setSearchParams,
}: VideoDurationRadioProps): React.ReactElement {
  const handleChange = (value: VideoDurationType) => {
    setSelectedVideoDuration(value);
    searchParams.set(selectedVideoDurationKey, value);
    setSearchParams(searchParams);
  };

  return (
    <>
      <Tr>
        <Th width={60} fontSize="large">
          Video Duration
        </Th>
        <Td>
          <RadioGroup
            onChange={(value) => {
              handleChange(value as VideoDurationType);
            }}
            value={selectedVideoDuration}
          >
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
