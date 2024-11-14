import React from 'react';
import { Radio, RadioGroup, Stack, Td, Th, Tr } from '@chakra-ui/react';

type VideoDurationType = 'full' | 'segment';
type VideoDurationRadioProps = {
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
};
export function VideoDurationRadio({
  searchParams,
  setSearchParams,
}: VideoDurationRadioProps): React.ReactElement {
  const handleChange = (value: VideoDurationType) => {
    searchParams.set('videoDuration', value);
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
            value={searchParams.get('videoDuration') || 'full'}
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
