import './globals.css';
import Link from 'next/link';
import { apiFetchServer } from './lib/api.server';
import LogoutButton from './ui/LogoutButton';
import ThemeToggle from './ui/ThemeToggle';

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
      <body className="min-h-screen bg-bg text-fg">
        <header className="sticky top-0 z-50 border-b border-border bg-card">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold tracking-tight text-blue-600">
              🐦 TwitterClone
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/" className="rounded-md px-3 py-1.5 text-sm hover:bg-muted">
                Feed
              </Link>


              {isLoggedIn ? (
                <>
                  <Link
                    href={`/profile/${me!.id}`}
                    className="rounded-md px-3 py-1.5 text-sm hover:bg-muted"
                  >
                    Profile
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="rounded-md px-3 py-1.5 text-sm hover:bg-muted"
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/register"
                    className="rounded-md px-3 py-1.5 text-sm hover:bg-muted"
                  >
                    Register
                  </Link>
                </>
              )}

              
              <ThemeToggle />
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
