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
   
  async (_context: GetServerSidePropsContext) => ({
    props: {},
  }),
);
