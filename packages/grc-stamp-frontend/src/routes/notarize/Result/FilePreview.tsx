import { CardMedia } from '@mui/material';
import React from 'react';
import { FileType } from './FileType';

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
  // console.log(file.type);
  return (
    <>
      {(isImage(file) && preview) ? (
        <CardMedia
          component="img"
          sx={{ width: 250, height: 250 }}
          image={preview}
          alt={file.name}
        />
      ) : (
        <CardMedia
          component="div"
          sx={{ width: 250, height: 250 }}
        >
          <FileType
            type={file.type}
            sx={{ fontSize: 250 }}
            color="disabled"
          />
        </CardMedia>
      )}
    </>
  );
}

export const FilePreview = React.memo(FilePreviewComponent);
