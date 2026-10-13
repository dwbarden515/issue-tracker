'use client';

import { Avatar, Box, Container, DropdownMenu, Flex, Text } from '@radix-ui/themes';
import classnames from 'classnames';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiFillBug } from 'react-icons/ai';

const NavBar = () => {
    return (
    <nav className='border-b mb-5 px-5 py-3'>
      <Container>
      <Flex justify="between">
        <Flex align="center" gap="3">
          <Link href="/">
            <AiFillBug />
          </Link>
          <NavLinks />
        </Flex>
        <AuthStatus />
      </Flex>
      </Container>
    </nav>
  )
};

const NavLinks = () => {
  const currentPath = usePathname();

    const links = [
        { label: 'Dashboard', href: '/' },
        { label: 'Issues', href: '/issues/list' },
    ]

  return (
    <ul className='flex space-x-6'>
            {links.map(link => 
            <li key={link.href}>
                <Link 
                className={classnames({
                    'nav-link': true,
                    'text-zinc-900!': link.href === currentPath,
                })} 
                href={link.href}>
                {link.label}</Link>
            </li>
            )}
          </ul>
  )
}

const AuthStatus = () => {
  const { status, data: session } = useSession();

  if (status === 'loading') return null;

  if (status === 'unauthenticated') 
    return <Link className='nav-link' href="/api/auth/signin">Log in</Link>; 

  return (
        <Box>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger aria-label="Open account menu">
              <Avatar
                className="cursor-pointer"
                src={session!.user?.image ?? undefined}
                fallback={(session!.user?.name?.[0] ?? session!.user?.email?.[0] ?? "?").toUpperCase()}
                size="2"
                radius="full"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Label>
                <Text size="2">
                  {session!.user?.email ?? session!.user?.name ?? "Account"}
                </Text>
              </DropdownMenu.Label>
              <DropdownMenu.Item onSelect={() => void signOut({ callbackUrl: "/" })}>
                Log out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
      </Box>
  )
}

export default NavBar
