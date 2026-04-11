import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface EndpointProps {
  method: Method;
  path: string;
  // eslint-disable-next-line react/require-default-props
  title?: string;
}

const Row = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.25, 2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(0, 0, 0, 0.015)',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
}));

const MethodPill = styled('span', {
  shouldForwardProp: (prop) => prop !== 'method',
})<{ method: Method }>(({ theme, method }) => {
  const paletteMap: Record<Method, string> = {
    GET: theme.palette.success.main,
    POST: theme.palette.secondary.main,
    PUT: theme.palette.primary.main,
    PATCH: theme.palette.primary.main,
    DELETE: theme.palette.error.main,
  };
  return {
    display: 'inline-block',
    padding: theme.spacing(0.5, 1.25),
    borderRadius: 999,
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    backgroundColor: paletteMap[method],
    color: theme.palette.common.white,
    minWidth: 56,
    textAlign: 'center',
  };
});

const PathCode = styled('code')(({ theme }) => ({
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  fontSize: '0.95rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  wordBreak: 'break-all',
}));

export function Endpoint({ method, path, title }: EndpointProps) {
  return (
    <Row>
      <MethodPill method={method}>{method}</MethodPill>
      <PathCode>{path}</PathCode>
      {title && (
        <Typography variant="body2" sx={{ color: 'text.secondary', ml: 'auto' }}>
          {title}
        </Typography>
      )}
    </Row>
  );
}
