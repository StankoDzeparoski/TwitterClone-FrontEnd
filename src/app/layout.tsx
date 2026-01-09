import './globals.css';
import Link from 'next/link';
import { apiFetchServer } from './lib/api.server';
import LogoutButton from './ui/LogoutButton';

type MeRes = { user: { id: string; username?: string } | null };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let me: MeRes['user'] = null;

  try {
    const res = await apiFetchServer<MeRes>('/auth/me', { cache: 'no-store' });
    me = res?.user ?? null;
  } catch {
    me = null;
  }

  const isLoggedIn = !!me?.id;

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <header className="sticky top-0 z-50 border-b bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold tracking-tight text-blue-600 hover:text-blue-700">
              🐦 TwitterClone
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Feed
              </Link>

              {isLoggedIn ? (
                <><Link
                  href={`/profile/${me!.id}`}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <LogoutButton /></>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/register"
                    className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
