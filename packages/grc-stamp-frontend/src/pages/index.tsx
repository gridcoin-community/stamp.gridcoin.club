import { Page } from '@/routes/notarize';
import { MaintenanceWrapper } from '@/routes/maintenance/MaintananceWrapper';

function IndexPage() {
  return (
    <MaintenanceWrapper>
      <Page />
    </MaintenanceWrapper>
  );
}

export default IndexPage;
