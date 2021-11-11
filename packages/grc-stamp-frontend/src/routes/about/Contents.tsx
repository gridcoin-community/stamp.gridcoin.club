import {
  List, ListItem, ListItemButton, ListItemText, Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const ContentsContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(7),
  position: 'fixed',
}));

export function Contents() {
  return (
    <ContentsContainer>
      <List disablePadding dense>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText>
              Proof of Existence
            </ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText>About the service</ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText>Protocol</ListItemText>
          </ListItemButton>
        </ListItem>
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
    </ContentsContainer>
  );
}
