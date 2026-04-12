import { GetServerSidePropsContext } from 'next';
import { withThemeDataServerSide } from '@/lib/modeDataServer';
import { NotFound } from '../routes/not-found';

export const getInitialProps = withThemeDataServerSide(
   
  async (_context: GetServerSidePropsContext) => ({
    props: {},
  }),
);

export default NotFound;
