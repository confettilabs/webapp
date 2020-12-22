import { useAuth0 } from '@auth0/auth0-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// function isActive(pathname) {
//   return (
//     typeof document !== "undefined" && document.location.pathname === pathname
//   )
// }

const Header = () => {
  const router = useRouter();
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  function isActive(pathname) {
    return router.pathname === pathname;
  }

  return (
    <nav>
      <div className="left">
        <Link href="/">
          <a className="bold" data-active={isActive('/')}>
            Blog
          </a>
        </Link>
        <Link href="/drafts">
          <a data-active={isActive('/drafts')}>Drafts</a>
        </Link>
      </div>
      <div className="right">
        {!isAuthenticated && (
          <button type="button" onClick={loginWithRedirect}>
            Log In
          </button>
        )}
        {isAuthenticated && (
          <button type="button" onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
          </button>
        )}
        <Link href="/create">
          <a data-active={isActive('/create')}>+ Create draft</a>
        </Link>
      </div>
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }

        .bold {
          font-weight: bold;
        }

        a,
        button {
          text-decoration: none;
          color: #000;
          display: inline-block;
        }

        .left a[data-active='true'] {
          color: gray;
        }

        a + a,
        button + a {
          margin-left: 1rem;
        }

        .right {
          margin-left: auto;
        }

        .right a,
        .right button {
          border: 1px solid black;
          padding: 0.5rem 1rem;
          border-radius: 3px;
        }
      `}</style>
    </nav>
  );
};

export default Header;
