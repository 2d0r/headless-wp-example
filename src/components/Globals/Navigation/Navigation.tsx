import Link from 'next/link';
import { print } from 'graphql/language/printer';

import styles from './Navigation.module.css';

import { MenuItem, RootQueryToMenuItemConnection } from '@/gql/graphql';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import gql from 'graphql-tag';

async function getData() {
  const menuQuery = gql`
    query MenuQuery {
      menuItems(where: { location: PRIMARY_MENU }) {
        nodes {
          uri
          target
          label
        }
      }
    }
  `;

  const { menuItems } = await fetchGraphQL<{
    menuItems: RootQueryToMenuItemConnection;
  }>(print(menuQuery));

  if (menuItems === null) {
    throw new Error('Failed to fetch data');
  }

  return menuItems;
}

export default async function Navigation() {
  const menuItems = await getData();

  return (
    <nav
      className='w-full h-18 p-8 flex items-center justify-between'
      role='navigation'
      itemScope
      itemType='http://schema.org/SiteNavigationElement'
    >
      <Link
        itemProp='url'
        href={'/'}
        target='_self'
      >
        <span itemProp='site' className='text-2xl'>Headless WP Example</span>
      </Link>
      <div className='flex gap-8'>
        {menuItems.nodes.map((item: MenuItem, index: number) => {
          if (!item.uri) return null;

          return (
            <Link
              itemProp='url'
              href={item.uri}
              key={index}
              target={item.target || '_self'}
            >
              <span itemProp='name'>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
