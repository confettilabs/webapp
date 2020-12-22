import Link from "next/link";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useAuth0 } from "@auth0/auth0-react";

import { withApollo } from "../apollo/client";
import Layout from "../components/Layout";

const FeedQuery = gql`
  query FeedQuery {
    feed {
      id
      title
      content
      published
      author {
        id
        name
      }
    }
  }
`;

const Post = ({ post }: { post: any }) => (
  <Link href="/p/[id]" as={`/p/${post.id}`}>
    <a>
      <h2>{post.title}</h2>
      <small>By {post.author.name}</small>
      <p>{post.content}</p>
      <style jsx>{`
        a {
          text-decoration: none;
          color: inherit;
          padding: 2rem;
          display: block;
        }
      `}</style>
    </a>
  </Link>
);

const Blog = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { loading, error, data } = useQuery(FeedQuery);

  if (isLoading || loading) {
    return <div>Loading ...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Layout>
      <div className="page">
        <h1>Confetti</h1>
        <main>
          <>
            {isAuthenticated &&
              data.feed.map((post: any) => (
                <div key={post.id} className="post">
                  <Post post={post} />
                </div>
              ))}
          </>
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default withApollo(Blog);
