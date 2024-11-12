import React from 'react';
import { Radio, RadioGroup, Stack, Td, Th, Tr } from '@chakra-ui/react';

export type VideoDurationType = 'full' | 'segment';
export function VideoDurationRadio({
  selectedVideoDuration,
  setSelectedVideoDuration,
}: {
  selectedVideoDuration: VideoDurationType;
  setSelectedVideoDuration: (videoDuration: VideoDurationType) => void;
}): React.ReactElement {
  return (
    <>
      <Tr>
        <Th width={60} fontSize="large">
          Video Duration
        </Th>
        <Td>
          <RadioGroup
            onChange={setSelectedVideoDuration}
            value={selectedVideoDuration}
          >
            <Stack direction="row">
              <Radio value="full">Full</Radio>
              <Radio value="segment" isDisabled>
                Segment
              </Radio>
            </Stack>
          </RadioGroup>
        </Td>
      </Tr>
    </>
  );
}
