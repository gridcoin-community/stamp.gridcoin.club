import { useState, useEffect } from 'react';
import { StatusRepository } from 'repositories/StatusRepository';
import { useInterval } from 'hooks';
import { StatusEntity } from 'entities/StatusEntity';
import { Page } from './index';

interface Props {
  children: React.ReactElement;
}

const statusRepository = new StatusRepository();

export function MaintenanceWrapper({ children }: Props) {
  const [statusData, setStatusData] = useState<StatusEntity>();

  const fetchStatusInfo = async () => {
    const walletEntity = await statusRepository.getStatusData();
    if (walletEntity) {
      setStatusData(walletEntity);
    }
  };

  useEffect(() => {
    fetchStatusInfo();
  }, []);

  useInterval(() => {
    fetchStatusInfo();
  }, 300_000);

  if (statusData && statusData.maintenance) {
    return <Page />;
  }
  return (
    <>
      {children}
    </>
  );
}
