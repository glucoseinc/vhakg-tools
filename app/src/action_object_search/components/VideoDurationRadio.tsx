import React from 'react';
import { Radio, RadioGroup, Select, Stack, Td, Th, Tr } from '@chakra-ui/react';

export function VideoDurationRadio({
  selectedVideoDuration,
  setSelectedVideoDuration,
}: {
  selectedVideoDuration: string;
  setSelectedVideoDuration: (videoDuration: string) => void;
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
