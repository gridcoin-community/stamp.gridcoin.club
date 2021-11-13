import {
  List, ListItem, ListItemButton, ListItemText, Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import React from 'react';

const ContentsContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(7),
  position: 'fixed',
}));

export function Contents() {
  return (
    <ContentsContainer>
      <List disablePadding dense>
        <Link href="#proof-of-existence" passHref>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>
                Proof of Existence
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        <Link href="#about-the-service" passHref>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>
                About the service
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        {/* <Link href="#protocol" passHref>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>Protocol</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link> */}
        <Link href="#costs" passHref>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>Costs</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        {/* <Link href="#credits" passHref>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>Credits</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link> */}
      </List>
    </ContentsContainer>
  );
}
