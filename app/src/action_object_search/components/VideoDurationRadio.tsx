import React from 'react';
import { Radio, RadioGroup, Stack, Td, Th, Tr } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';

export type VideoDurationType = 'full' | 'segment';
type VideoDurationRadioProps = {
  selectedVideoDuration: VideoDurationType;
  setSelectedVideoDuration: (videoDuration: VideoDurationType) => void;
};
export function VideoDurationRadio({
  selectedVideoDuration,
  setSelectedVideoDuration,
}: VideoDurationRadioProps): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (value: VideoDurationType) => {
    setSelectedVideoDuration(value);
    searchParams.set('selectedVideoDuration', value);
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
