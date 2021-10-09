import React from 'react';
import ArchiveIcon from '@mui/icons-material/ArchiveOutlined';
import DefaultIcon from '@mui/icons-material/DescriptionOutlined';
import FontIcon from '@mui/icons-material/FontDownloadOutlined';

interface Props {
  type: string;
  [x:string]: any;
}

export function FileType({ type, ...rest }: Props) {
  switch (type) {
    case 'application/zip':
    case 'application/x-bzip':
    case 'application/x-xz':
      return <ArchiveIcon {...rest} />;
    case 'font/ttf':
      return <FontIcon {...rest} />;
    default:
      return <DefaultIcon {...rest} />;
  }
}
