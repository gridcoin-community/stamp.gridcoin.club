import { Page } from 'routes/about';
import { MaintenanceWrapper } from 'routes/maintenance/MaintananceWrapper';

function AboutPage() {
  return (
    <MaintenanceWrapper>
      <Page />
    </MaintenanceWrapper>
  );
}

export default AboutPage;
