import { Typography, Box } from '@mui/material';
import React from 'react';

function ChapterCredits() {
  return (
    <Box>
      <Typography variant="h4" component="h3" pb={2}>
        Credits
      </Typography>
      <Box component="article">
        <Typography gutterBottom variant="body1" component="p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel commodo ex. Mauris consequat tempus euismod. Ut porttitor malesuada ligula, in accumsan mi euismod vel. Fusce feugiat pellentesque ipsum, et aliquam justo sagittis nec. Pellentesque laoreet diam in mauris scelerisque facilisis. Praesent in urna eget mauris aliquet rhoncus vel nec elit. Curabitur nec velit lectus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut facilisis libero at mauris dapibus tempor. Integer convallis luctus ligula a tristique. Duis commodo dictum magna. Integer ac neque et velit accumsan dignissim sit amet quis arcu. Donec at ipsum sed risus dapibus tincidunt ut ut justo.</Typography>
        <Typography gutterBottom variant="body1" component="p">Maecenas odio enim, semper id hendrerit quis, gravida sit amet nibh. Etiam ac purus ac nisi commodo feugiat. Mauris quis justo non diam varius convallis sed eget massa. Proin tempor tortor sed mauris volutpat, quis laoreet eros fermentum. Aenean nec nunc in sapien fringilla pulvinar. Sed at placerat tellus. Aenean mollis nulla nec ante sodales, elementum consequat sapien consequat. Aliquam augue tortor, faucibus eget quam quis, laoreet pulvinar urna. Duis et massa sed diam dapibus luctus ut quis lorem. Mauris in enim in purus semper euismod eu in odio. Pellentesque non pretium dui. Quisque placerat sit amet ipsum eget aliquam. Ut convallis arcu sit amet augue accumsan, sit amet viverra lorem iaculis.</Typography>
        <Typography gutterBottom variant="body1" component="p">Morbi pulvinar laoreet nulla, vehicula viverra lacus efficitur vulputate. Praesent auctor magna a nisi viverra pellentesque. Nulla facilisi. Curabitur vitae molestie ipsum. Mauris maximus faucibus placerat. Sed viverra posuere quam, eget malesuada sapien faucibus eu. Sed rhoncus nisl augue, sed venenatis enim malesuada sit amet. Sed convallis mauris id nunc maximus pharetra ac at est. Suspendisse semper tellus non magna euismod, et congue odio posuere. Ut quis neque eu libero dictum vestibulum. Mauris porta orci quis mi commodo pulvinar. Mauris suscipit laoreet purus a interdum. Fusce lacus justo, molestie vitae congue eu, imperdiet eget dolor. Proin convallis felis erat, condimentum volutpat ipsum sollicitudin eget.</Typography>
        <Typography gutterBottom variant="body1" component="p">Phasellus vulputate luctus finibus. In cursus tincidunt elit, et convallis lorem luctus nec. Integer nibh velit, varius a pretium eu, egestas nec nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam nec placerat ex. Mauris porta tempus quam sit amet fringilla. Fusce diam turpis, euismod vitae magna non, accumsan placerat ligula.</Typography>
        <Typography gutterBottom variant="body1" component="p">Duis nisl purus, tristique eu convallis nec, consequat vel elit. Aliquam erat volutpat. Curabitur convallis euismod lacus, elementum ultrices eros faucibus in. Mauris ullamcorper ultricies neque, ut egestas metus varius vel. Suspendisse vehicula id massa non accumsan. Integer semper dignissim enim nec pharetra. Proin odio velit, tincidunt quis velit in, accumsan maximus lacus. Duis pretium viverra efficitur. In interdum est et leo iaculis, ut placerat elit molestie. Proin fermentum pretium est, vitae pretium sem egestas ac. Sed elementum magna ut justo mollis, vel interdum enim consectetur. Donec facilisis, nisi sed efficitur facilisis, quam purus ornare orci, nec luctus nisi nibh ac ligula. Mauris nunc nisl, molestie sit amet ligula in, semper molestie dui. Suspendisse pellentesque lobortis massa, vel imperdiet mauris hendrerit in. Vivamus vel turpis a enim aliquet semper.</Typography>
      </Box>
    </Box>
  );
}

export const Credits = React.memo(ChapterCredits);
