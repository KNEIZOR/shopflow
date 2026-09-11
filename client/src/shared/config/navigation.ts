export type NavigationItem = {
    path: string;
    labelKey: string;
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        path: '/',
        labelKey: 'header.home',
    },
    {
        path: '/catalog',
        labelKey: 'header.catalog',
    },
];
