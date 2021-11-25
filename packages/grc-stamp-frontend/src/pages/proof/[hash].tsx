import { StampEntity, StampRawData } from 'entities/StampEntity';
import { StampRepository } from 'repositories/StampsRepository';
import { Page } from 'routes/proof';

interface Props {
  stampData: Partial<StampRawData>;
}

const Post = ({ stampData }: Props) => {
  const stamp = new StampEntity(stampData);
  return (
    <Page stamp={stamp} />
  );
};

interface Context {
  params: {
    hash: string,
  }
}

type ServerSideProps = { props: Partial<Props> } | { notFound: boolean };

export async function getServerSideProps(context: Context): Promise<ServerSideProps> {
  const { hash } = context.params;
  const repository = new StampRepository();
  const stamp = await repository.findStampByHash(hash);

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
}

export default Post;
