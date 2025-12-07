import { GetServerSidePropsContext } from 'next';
import { withThemeDataServerSide } from '@/lib/modeDataServer';
import { NotFound } from '../routes/not-found';

export const getInitialProps = withThemeDataServerSide(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_context: GetServerSidePropsContext) => ({
    props: {},
  }),
);

export default NotFound;
