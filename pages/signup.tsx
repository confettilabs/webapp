import React, { useState } from 'react';
import Router from 'next/router';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { withApollo } from '../apollo/client';
import Layout from '../components/Layout';

const SignupMutation = gql`
  mutation SignupMutation($name: String, $email: String!) {
    signupUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

function Signup() {
  const [name, setName] = useState(``);
  const [email, setEmail] = useState(``);

  const [signup] = useMutation(SignupMutation);

  return (
    <Layout>
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            console.log(`submit`, name, email);

            await signup({
              variables: {
                name,
                email,
              },
            });
            Router.push(`/`);
          }}
        >
          <h1>Signup user</h1>
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input autoFocus onChange={(e) => setName(e.target.value)} placeholder="Name" type="text" value={name} />
          <input onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" value={email} />
          <input disabled={!name || !email} type="submit" value="Signup" />
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="back" href="#" onClick={() => Router.push(`/`)}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
        }

        input[type='text'],
        input[type='email'] {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type='submit'] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
}

export default withApollo(Signup);
