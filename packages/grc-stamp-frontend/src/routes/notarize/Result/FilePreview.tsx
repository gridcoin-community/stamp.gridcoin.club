import { CardMedia } from '@mui/material';
import React from 'react';

interface Props {
  file: File;
  preview: string | undefined;
}

export function isImage(file: File): boolean {
  if (file.type.split('/')[0] === 'image') {
    return true;
  }
  return false;
}

/**
 * Render avatar, seems like it works fine with memo and proper properties
 *
 * @param {Props} { file, preview }
 * @returns
 */
function FilePreviewComponent({ file, preview }: Props) {
  // console.log('📙 FilePreview re-renders 📙');
  return (
    <>
      {(isImage(file) && preview) ? (
        <CardMedia
          component="img"
          sx={{ width: 250, height: 250 }}
          image={preview}
          alt={file.name}
        />
      ) : (<span />)}
    </>
  );
}

export const FilePreview = React.memo(FilePreviewComponent);
