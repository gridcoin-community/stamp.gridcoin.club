import { GetServerSidePropsContext } from 'next';
import { withThemeDataServerSide } from '@/lib/modeDataServer';
import { Page } from '@/routes/about';
import { MaintenanceWrapper } from '@/routes/maintenance/MaintananceWrapper';

export default function AboutPage() {
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
