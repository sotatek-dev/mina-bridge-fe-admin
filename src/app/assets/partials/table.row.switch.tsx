'use client';
import { Switch } from '@chakra-ui/react';

import useAssetLogic from '../hooks/useAssetsLogic';

import { STATUS } from '@/services/adminService';

type RowStatusProps = {
  id: number;
  isHidden: boolean;
  status: STATUS;
};

function RowSwitch({ id, isHidden, status }: RowStatusProps) {
  const { toggleHideShowAsset } = useAssetLogic();
  return (
    <Switch
      isDisabled={status !== STATUS.ENABLE && status !== STATUS.DISABLE}
      isChecked={!isHidden}
      onChange={() => toggleHideShowAsset({ id, isHidden })}
      sx={{
        '.chakra-switch__track[data-checked]': {
          backgroundColor: 'primary.purple',
        },
      }}
    />
  );
}

export default RowSwitch;
