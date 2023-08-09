import { BsCart2, BsCardList } from 'react-icons/bs';

export const sidebarRoute = [
    {
        title: 'Products',
        route: '/',
        icon: <BsCardList />
    },
    {
        title: 'Carts',
        route: '/carts',
        icon: <BsCart2 />
    }
];
