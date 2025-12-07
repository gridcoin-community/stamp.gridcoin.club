import { GetServerSideProps } from 'next';
import { StampEntity, StampRawData } from '@/entities/StampEntity';
import { withThemeDataServerSide } from '@/lib/modeDataServer';
import { StampRepository } from '@/repositories/StampsRepository';
import { Page } from '@/routes/proof';

interface Props {
  stampData: Partial<StampRawData>;
}

export default function Post({ stampData }: Props) {
  const stamp = new StampEntity(stampData);
  return (
    <Page stamp={stamp} />
  );
}

const getStampDataServerSide: GetServerSideProps<Partial<Props>> = async (
  context,
) => {
  const hashCandidate = context.params?.hash;
  // guard against missing or array params
  if (!hashCandidate || Array.isArray(hashCandidate)) {
    return { notFound: true };
  }
  const hash = hashCandidate;

  const repository = new StampRepository();
  const stamp = await repository.findStampByHash(hash, true);

  if (!stamp || !stamp.isFinished()) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      stampData: stamp.toJson(),
    },
  };
};

export const getServerSideProps = withThemeDataServerSide<Partial<Props>>(
  getStampDataServerSide,
);
