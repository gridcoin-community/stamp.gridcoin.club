/* eslint-disable max-len */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Alert,
  AlertTitle,
} from '@mui/material';
import { CodeBlock } from '@/components/CodeBlock/CodeBlock';

export function Conventions() {
  return (
    <Box pb={4} id="conventions">
      <Typography variant="h4" component="h2" pb={2}>
        JSON:API Conventions
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">
          Collection endpoints support the standard JSON:API query parameters for
          pagination, sorting, sparse fieldsets, and filtering. Every parameter is
          optional; omitting all of them returns the first page of results in default
          order.
        </Typography>

        <Typography variant="h6" component="h3" pt={2} pb={1}>
          Pagination
        </Typography>
        <List dense>
          <ListItem disableGutters>
            <ListItemText
              primary={<><code>page[size]</code> — items per page</>}
              secondary="Default 25, maximum 100. Values above 100 are silently capped. A value of 0 falls back to the default of 25."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={<><code>page[number]</code> — zero-indexed page number</>}
              secondary="Offset is computed as page[number] × page[size]. Mutually exclusive with page[offset]."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={<><code>page[offset]</code> — absolute record offset</>}
              secondary="Skip N records before returning results."
            />
          </ListItem>
        </List>
        <Typography gutterBottom variant="body1" component="p">
          Every list response includes a top-level
          {' '}
          <code>meta.count</code>
          {' '}
          field with the total number of records matching the query.
        </Typography>

        <Typography variant="h6" component="h3" pt={2} pb={1}>
          Sorting
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Pass
          {' '}
          <code>sort=field</code>
          {' '}
          for ascending order or
          {' '}
          <code>sort=-field</code>
          {' '}
          for descending. Multiple fields can be comma-separated
          (e.g.
          {' '}
          <code>sort=-block,-id</code>
          ). Unspecified sort falls back to ascending
          {' '}
          <code>id</code>
          .
        </Typography>

        <Typography variant="h6" component="h3" pt={2} pb={1}>
          Sparse Fieldsets
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Restrict the returned attributes with
          {' '}
          <code>fields[stamps]=id,hash,block</code>
          {' '}
          to reduce payload size. Keep
          {' '}
          <code>id</code>
          {' '}
          in the list — JSON:API requires it on every resource object.
        </Typography>

        <Typography variant="h6" component="h3" pt={2} pb={1}>
          Filtering
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Simple exact-match filtering works on any field with
          {' '}
          <code>filter[field]=value</code>
          . Comparison operators are available via
          {' '}
          <code>filter[field][op]=value</code>
          . Supported operators:
          {' '}
          <code>eq</code>
          ,
          {' '}
          <code>ne</code>
          ,
          {' '}
          <code>gt</code>
          ,
          {' '}
          <code>gte</code>
          ,
          {' '}
          <code>lt</code>
          ,
          {' '}
          <code>lte</code>
          .
        </Typography>
        <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
          <AlertTitle>Comparison operators are for numeric fields</AlertTitle>
          The
          {' '}
          <code>gt / gte / lt / lte / ne / eq</code>
          {' '}
          operators are only meaningful on numeric fields like
          {' '}
          <code>id</code>
          ,
          {' '}
          <code>block</code>
          , and
          {' '}
          <code>time</code>
          . Filtering a string field like
          {' '}
          <code>hash</code>
          {' '}
          by exact match works with the simple form (
          <code>filter[hash]=&lt;64 hex chars&gt;</code>
          ), but comparison operators on strings will return an empty result or an
          error.
        </Alert>

        <Typography variant="h6" component="h3" pt={3} pb={1}>
          Example
        </Typography>
        <Typography gutterBottom variant="body1" component="p">
          Fetch the 10 most recent confirmed stamps, returning only id, hash, block,
          and time:
        </Typography>
        <CodeBlock
          caption="Request"
          language="bash"
          code={`curl -G 'https://stamp.gridcoin.club/api/stamps' \\
  --data-urlencode 'page[size]=10' \\
  --data-urlencode 'sort=-block' \\
  --data-urlencode 'fields[stamps]=id,hash,block,time' \\
  --data-urlencode 'filter[block][gt]=0'`}
        />
      </Box>
    </Box>
  );
}
