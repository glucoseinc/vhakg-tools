import { Button, Center } from '@chakra-ui/react';
import {
  IRI_KEY,
  MAIN_OBJECT_KEY,
  TARGET_OBJECT_KEY,
} from 'constants/action_object_search/constants';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function BackToVideoSearchButton(): React.ReactElement {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);

    // 2d-bbox-pageを決定するパラメータの組み合わせごとに、
    // 直近の遷移元の動画検索結果を表示するためのクエリパラメータをlocalStorageに保存している
    const localStorageKey = new URLSearchParams({
      [MAIN_OBJECT_KEY]: searchParams.get(MAIN_OBJECT_KEY) || '',
      [TARGET_OBJECT_KEY]: searchParams.get(TARGET_OBJECT_KEY) || '',
      [IRI_KEY]: searchParams.get(IRI_KEY) || '',
    }).toString();

    const videoSearchParams = localStorage.getItem(localStorageKey);
    if (videoSearchParams) {
      navigate('/action-object-search?' + videoSearchParams);
    } else {
      navigate('/action-object-search');
    }
  }, []);
  return (
    <Center>
      <Button onClick={handleClick}>Back</Button>
    </Center>
  );
}
