export type SeedCategory = {
    slug: string;
    name: string;
    description: string;
    imageUrl: string;
    translations: {
        language: string;
        name: string;
        description: string;
    }[];
};

export const categories: SeedCategory[] = [
    {
        slug: 'smartphones',
        name: 'Smartphones',
        description: 'Modern smartphones and mobile devices.',
        imageUrl:
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
        translations: [
            {
                language: 'ru',
                name: 'Смартфоны',
                description: 'Современные смартфоны и мобильные устройства.',
            },
            {
                language: 'en',
                name: 'Smartphones',
                description: 'Modern smartphones and mobile devices.',
            },
        ],
    },
    {
        slug: 'laptops',
        name: 'Laptops',
        description: 'Laptops for work, study and entertainment.',
        imageUrl:
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
        translations: [
            {
                language: 'ru',
                name: 'Ноутбуки',
                description: 'Ноутбуки для работы, учёбы и развлечений.',
            },
            {
                language: 'en',
                name: 'Laptops',
                description: 'Laptops for work, study and entertainment.',
            },
        ],
    },
    {
        slug: 'headphones',
        name: 'Headphones',
        description: 'Wireless and wired headphones.',
        imageUrl:
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        translations: [
            {
                language: 'ru',
                name: 'Наушники',
                description: 'Беспроводные и проводные наушники.',
            },
            {
                language: 'en',
                name: 'Headphones',
                description: 'Wireless and wired headphones.',
            },
        ],
    },
    {
        slug: 'smartwatches',
        name: 'Smart Watches',
        description: 'Smart watches and fitness wearables.',
        imageUrl:
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        translations: [
            {
                language: 'ru',
                name: 'Смарт-часы',
                description: 'Смарт-часы и фитнес-устройства.',
            },
            {
                language: 'en',
                name: 'Smart Watches',
                description: 'Smart watches and fitness wearables.',
            },
        ],
    },
    {
        slug: 'furniture',
        name: 'Furniture',
        description: 'Modern furniture for contemporary interiors.',
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
        translations: [
            {
                language: 'ru',
                name: 'Мебель',
                description: 'Современная мебель для интерьера.',
            },
            {
                language: 'en',
                name: 'Furniture',
                description: 'Modern furniture for contemporary interiors.',
            },
        ],
    },
    {
        slug: 'lighting',
        name: 'Lighting',
        description: 'Decorative and functional lighting.',
        imageUrl:
            'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f',
        translations: [
            {
                language: 'ru',
                name: 'Освещение',
                description: 'Декоративное и функциональное освещение.',
            },
            {
                language: 'en',
                name: 'Lighting',
                description: 'Decorative and functional lighting.',
            },
        ],
    },
    {
        slug: 'fashion',
        name: 'Fashion',
        description: 'Clothing and everyday fashion.',
        imageUrl:
            'https://images.unsplash.com/photo-1445205170230-053b83016050',
        translations: [
            {
                language: 'ru',
                name: 'Одежда',
                description: 'Одежда и повседневная мода.',
            },
            {
                language: 'en',
                name: 'Fashion',
                description: 'Clothing and everyday fashion.',
            },
        ],
    },
    {
        slug: 'sneakers',
        name: 'Sneakers',
        description: 'Sneakers for everyday life and sport.',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        translations: [
            {
                language: 'ru',
                name: 'Кроссовки',
                description: 'Кроссовки для повседневной жизни и спорта.',
            },
            {
                language: 'en',
                name: 'Sneakers',
                description: 'Sneakers for everyday life and sport.',
            },
        ],
    },
    {
        slug: 'bags',
        name: 'Bags',
        description: 'Backpacks, travel bags and everyday bags.',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
        translations: [
            {
                language: 'ru',
                name: 'Сумки',
                description: 'Рюкзаки, дорожные и повседневные сумки.',
            },
            {
                language: 'en',
                name: 'Bags',
                description: 'Backpacks, travel bags and everyday bags.',
            },
        ],
    },
    {
        slug: 'home-decor',
        name: 'Home Decor',
        description: 'Decorative products for your home.',
        imageUrl:
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
        translations: [
            {
                language: 'ru',
                name: 'Декор',
                description: 'Декоративные товары для дома.',
            },
            {
                language: 'en',
                name: 'Home Decor',
                description: 'Decorative products for your home.',
            },
        ],
    },
];
