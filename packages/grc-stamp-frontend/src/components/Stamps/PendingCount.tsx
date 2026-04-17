import { useCallback, useState } from 'react';
import { Typography, Chip, useMediaQuery, useTheme } from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useSSEEvent } from '@/hooks';
import { PendingCountEvent } from '@/types';

const flip = keyframes`
  0%, 75% { transform: rotate(0deg); }
  85% { transform: rotate(180deg); }
  100% { transform: rotate(180deg); }
`;

const CountChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  borderRadius: theme.spacing(2),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  height: 32,
  '& .MuiChip-label': {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(0.5),
  },
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  },
}));

const AnimatedIcon = styled(HourglassBottomIcon)({
  animation: `${flip} 4s ease-in-out infinite`,
});

export function PendingCount() {
  const [count, setCount] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useSSEEvent(
    'pendingCount',
    useCallback((data: PendingCountEvent['data']) => {
      setCount(data.count);
    }, []),
  );

  if (count === null || count === 0) return null;

  const noun = count === 1 ? 'stamp' : 'stamps';
  const label = isMobile ? 'pending' : `${noun} awaiting confirmation`;

  return (
    <CountChip
      icon={<AnimatedIcon fontSize="small" />}
      label={(
        <Typography variant="body2" component="span">
          <strong>{count}</strong>
          {' '}
          {label}
        </Typography>
      )}
    />
  );
}
