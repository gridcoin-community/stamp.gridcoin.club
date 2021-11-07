import {
  List, ListItem, ListItemButton, ListItemText,
} from '@mui/material';
import React from 'react';

export function Contents() {
  return (
    <List disablePadding dense>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemText>Costs</ListItemText>
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemText>Credits</ListItemText>
        </ListItemButton>
      </ListItem>
    </List>
  );
}
