import { useRouter } from 'next/router';
import axios from 'axios';

const Post = () => {
  const router = useRouter();
  const { hash } = router.query;

  return (
    <p>
      Post:
      {' '}
      {hash}
    </p>
  );
};

interface Context {
  params: {
    hash: string,
  }
}

interface Result {
  meta: {
    count: number;
  }
  data: {

  }
}

// type ServerSideProps = { props: Partial<Props> } | { notFound: boolean };

export async function getServerSideProps(context: Context) {
  const { hash } = context.params;
  const { data } = await axios.get<Result>(`${process.env.NEXT_PUBLIC_API_URL}/stamps?filter[hash]=${hash}`);
  console.log(JSON.stringify(data, null, 2));

  if (!data || !data.meta.count) {
    return {
      notFound: true,
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Post;
