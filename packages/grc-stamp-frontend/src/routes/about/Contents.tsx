import {
  List, ListItem, ListItemButton, ListItemText, Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { NextMuiLink } from '@/components/NextMuiLink';

const ContentsContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(7),
  position: 'fixed',
}));

export function Contents() {
  return (
    <ContentsContainer>
      <List disablePadding dense>
        <NextMuiLink href="#proof-of-existence" passHref>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>
                Proof of Existence
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </NextMuiLink>
        <NextMuiLink href="#about-the-service" passHref>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>
                About the Service
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </NextMuiLink>
        <NextMuiLink href="#protocol-overview" passHref>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>Protocol Summary</ListItemText>
            </ListItemButton>
          </ListItem>
        </NextMuiLink>
        <NextMuiLink href="#costs" passHref>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>Costs</ListItemText>
            </ListItemButton>
          </ListItem>
        </NextMuiLink>
        {/* <NextMuiLink href="#credits" passHref>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>Credits</ListItemText>
            </ListItemButton>
          </ListItem>
        </NextMuiLink> */}
      </List>
    </ContentsContainer>
  );
}
