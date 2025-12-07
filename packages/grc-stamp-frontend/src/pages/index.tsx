'use server';

import { GetServerSidePropsContext } from 'next';
import { Page } from '@/routes/notarize';
import { MaintenanceWrapper } from '@/routes/maintenance/MaintananceWrapper';
import { withThemeDataServerSide } from '@/lib/modeDataServer';

export default function IndexPage() {
  return (
    <MaintenanceWrapper>
      <Page />
    </MaintenanceWrapper>
  );
}

export const getServerSideProps = withThemeDataServerSide(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_context: GetServerSidePropsContext) => ({
    props: {},
  }),
);
