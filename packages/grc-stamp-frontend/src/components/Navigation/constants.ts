export interface MenuLeaf {
  label: string;
  href: string;
}

export interface MenuGroup {
  label: string;
  children: MenuLeaf[];
}

export type MenuEntry = MenuLeaf | MenuGroup;

export const isMenuGroup = (entry: MenuEntry): entry is MenuGroup => (
  (entry as MenuGroup).children !== undefined
);

export const menuItems: MenuEntry[] = [
  { label: 'Stamp', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'For Developers',
    children: [
      { label: 'API Documentation', href: '/developers' },
      { label: 'GitHub Action', href: '/developers/github-action' },
    ],
  },
];
