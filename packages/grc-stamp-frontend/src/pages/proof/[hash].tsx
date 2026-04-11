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

  // Only 404 if the hash has never been submitted to this service.
  // Stamps that exist but aren't yet confirmed on chain render as "in progress"
  // and poll/listen for the confirmation on the client side.
  if (!stamp) {
    return {
      notFound: true,
    };
  }

  if (stamp.isFinished()) {
    // Confirmed proofs are immutable — cache aggressively.
    context.res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  } else {
    // Pending stamps must never be cached; the state changes within minutes.
    context.res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
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
