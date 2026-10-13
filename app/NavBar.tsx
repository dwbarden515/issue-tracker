'use client';

import { Avatar, Box, Container, DropdownMenu, Flex, Text } from '@radix-ui/themes';
import classnames from 'classnames';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiFillBug } from 'react-icons/ai';

const NavBar = () => {
    const currentPath = usePathname();
    const { status, data: session } = useSession();

    const links = [
        { label: 'Dashboard', href: '/' },
        { label: 'Issues', href: '/issues/list' },
    ]

  return (
    <nav className='border-b mb-5 px-5 py-3'>
      <Container>
      <Flex justify="between">
        <Flex align="center" gap="3">
          <Link href="/">
            <AiFillBug />
          </Link>
          <ul className='flex space-x-6'>
            {links.map(link => 
            <li key={link.href}>
                <Link 
                className={classnames({
                    'text-zinc-900': link.href === currentPath,
                    'text-zinc-500': link.href !== currentPath,
                    'hover:text-zinc-800 transition-colors': true
                })} 
                href={link.href}>
                {link.label}</Link>
            </li>
            )}
          </ul>
        </Flex>
        <Box>
        {status === "authenticated" && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger aria-label="Open account menu">
              <Avatar
                className="cursor-pointer"
                src={session.user?.image ?? undefined}
                fallback={(session.user?.name?.[0] ?? session.user?.email?.[0] ?? "?").toUpperCase()}
                size="2"
                radius="full"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Label>
                <Text size="2">
                  {session.user?.email ?? session.user?.name ?? "Account"}
                </Text>
              </DropdownMenu.Label>
              <DropdownMenu.Item onSelect={() => void signOut({ callbackUrl: "/" })}>
                Log out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          )}

        {status === "unauthenticated" && (
          <Link href="/api/auth/signin">Log in</Link>
          )}
      </Box>
      </Flex>
      </Container>
    </nav>
  )
}

export default NavBar
