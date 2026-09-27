export type SeedAttribute = {
    name: string;
    slug: string;
    type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT';
    scope: 'PRODUCT' | 'VARIANT' | 'BOTH';
    required?: boolean;
    options?: string[];
};

export type SeedProductType = {
    name: string;
    slug: string;
    description: string;
    attributes: SeedAttribute[];
};

export const productTypes: SeedProductType[] = [
    {
        name: 'Smartphone',
        slug: 'smartphone',
        description: 'Mobile smartphones.',
        attributes: [
            {
                name: 'Brand',
                slug: 'brand',
                type: 'SELECT',
                scope: 'PRODUCT',
                required: true,
                options: ['Apple', 'Samsung', 'Google', 'Xiaomi', 'OnePlus'],
            },
            {
                name: 'Storage',
                slug: 'storage',
                type: 'SELECT',
                scope: 'VARIANT',
                required: true,
                options: ['128 GB', '256 GB', '512 GB', '1 TB'],
            },
            {
                name: 'RAM',
                slug: 'ram',
                type: 'SELECT',
                scope: 'PRODUCT',
                required: true,
                options: ['6 GB', '8 GB', '12 GB', '16 GB'],
            },
            {
                name: 'Display',
                slug: 'display',
                type: 'TEXT',
                scope: 'PRODUCT',
            },
        ],
    },
    {
        name: 'Laptop',
        slug: 'laptop',
        description: 'Portable computers.',
        attributes: [
            {
                name: 'Brand',
                slug: 'laptop-brand',
                type: 'SELECT',
                scope: 'PRODUCT',
                required: true,
                options: ['Apple', 'ASUS', 'Lenovo', 'Dell', 'HP'],
            },
            {
                name: 'RAM',
                slug: 'laptop-ram',
                type: 'SELECT',
                scope: 'VARIANT',
                required: true,
                options: ['8 GB', '16 GB', '32 GB', '64 GB'],
            },
            {
                name: 'Storage',
                slug: 'laptop-storage',
                type: 'SELECT',
                scope: 'VARIANT',
                required: true,
                options: ['512 GB', '1 TB', '2 TB'],
            },
            {
                name: 'Screen',
                slug: 'screen-size',
                type: 'SELECT',
                scope: 'PRODUCT',
                options: ['13.3"', '14"', '15.6"', '16"'],
            },
        ],
    },
    {
        name: 'Headphones',
        slug: 'headphones',
        description: 'Audio headphones.',
        attributes: [
            {
                name: 'Brand',
                slug: 'headphone-brand',
                type: 'SELECT',
                scope: 'PRODUCT',
                options: ['Sony', 'Apple', 'Bose', 'Sennheiser', 'JBL'],
            },
            {
                name: 'Connection',
                slug: 'connection',
                type: 'SELECT',
                scope: 'VARIANT',
                options: ['Black', 'White', 'Silver'],
            },
            {
                name: 'Wireless',
                slug: 'wireless',
                type: 'BOOLEAN',
                scope: 'PRODUCT',
            },
            {
                name: 'Battery',
                slug: 'battery',
                type: 'NUMBER',
                scope: 'PRODUCT',
            },
        ],
    },
    {
        name: 'Smart Watch',
        slug: 'smart-watch',
        description: 'Smart watches and wearables.',
        attributes: [
            {
                name: 'Brand',
                slug: 'watch-brand',
                type: 'SELECT',
                scope: 'PRODUCT',
                options: ['Apple', 'Samsung', 'Garmin', 'Huawei', 'Amazfit'],
            },
            {
                name: 'Case Size',
                slug: 'case-size',
                type: 'SELECT',
                scope: 'VARIANT',
                options: ['40 mm', '41 mm', '44 mm', '45 mm', '47 mm'],
            },
            {
                name: 'Water Resistant',
                slug: 'water-resistant',
                type: 'BOOLEAN',
                scope: 'PRODUCT',
            },
        ],
    },
    {
        name: 'Furniture',
        slug: 'furniture',
        description: 'Furniture products.',
        attributes: [
            {
                name: 'Material',
                slug: 'furniture-material',
                type: 'SELECT',
                scope: 'PRODUCT',
                options: ['Oak', 'Walnut', 'Metal', 'Fabric', 'Leather'],
            },
            {
                name: 'Color',
                slug: 'furniture-color',
                type: 'SELECT',
                scope: 'VARIANT',
                options: ['Natural', 'Black', 'White', 'Beige', 'Brown'],
            },
            {
                name: 'Width',
                slug: 'width',
                type: 'NUMBER',
                scope: 'PRODUCT',
            },
        ],
    },
    {
        name: 'Lighting',
        slug: 'lighting',
        description: 'Lighting products.',
        attributes: [
            {
                name: 'Material',
                slug: 'lighting-material',
                type: 'SELECT',
                scope: 'PRODUCT',
                options: ['Metal', 'Glass', 'Wood', 'Ceramic'],
            },
            {
                name: 'Color',
                slug: 'lighting-color',
                type: 'SELECT',
                scope: 'VARIANT',
                options: ['Black', 'White', 'Brass', 'Gold'],
            },
            {
                name: 'Bulb Type',
                slug: 'bulb-type',
                type: 'SELECT',
                scope: 'PRODUCT',
                options: ['LED', 'E27', 'GU10'],
            },
        ],
    },
    {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Clothing and apparel.',
        attributes: [
            {
                name: 'Brand',
                slug: 'clothing-brand',
                type: 'SELECT',
                scope: 'PRODUCT',
                options: ['Nike', 'Adidas', 'Uniqlo', 'Levi’s', 'COS'],
            },
            {
                name: 'Size',
                slug: 'clothing-size',
                type: 'SELECT',
                scope: 'VARIANT',
                options: ['XS', 'S', 'M', 'L', 'XL'],
            },
            {
                name: 'Color',
                slug: 'clothing-color',
                type: 'SELECT',
                scope: 'VARIANT',
                options: ['Black', 'White', 'Grey', 'Navy', 'Beige'],
            },
            {
                name: 'Material',
                slug: 'clothing-material',
                type: 'TEXT',
                scope: 'PRODUCT',
            },
        ],
    },
    {
        name: 'Sneakers',
        slug: 'sneakers',
        description: 'Sneakers and sports shoes.',
        attributes: [
            {
                name: 'Brand',
                slug: 'sneaker-brand',
                type: 'SELECT',
                scope: 'PRODUCT',
                options: ['Nike', 'Adidas', 'New Balance', 'Puma', 'Asics'],
            },
            {
                name: 'Size',
                slug: 'sneaker-size',
                type: 'SELECT',
                scope: 'VARIANT',
                options: ['40', '41', '42', '43', '44', '45'],
            },
            {
                name: 'Color',
                slug: 'sneaker-color',
                type: 'SELECT',
                scope: 'VARIANT',
                options: ['Black', 'White', 'Grey', 'Green', 'Blue'],
            },
        ],
    },
    {
        name: 'Bag',
        slug: 'bag',
        description: 'Bags and backpacks.',
        attributes: [
            {
                name: 'Brand',
                slug: 'bag-brand',
                type: 'SELECT',
                scope: 'PRODUCT',
                options: [
                    'Herschel',
                    'Fjallraven',
                    'Eastpak',
                    'Nike',
                    'Adidas',
                ],
            },
            {
                name: 'Material',
                slug: 'bag-material',
                type: 'SELECT',
                scope: 'PRODUCT',
                options: ['Nylon', 'Leather', 'Canvas', 'Polyester'],
            },
            {
                name: 'Color',
                slug: 'bag-color',
                type: 'SELECT',
                scope: 'VARIANT',
                options: ['Black', 'Grey', 'Navy', 'Olive', 'Brown'],
            },
        ],
    },
    {
        name: 'Home Decor',
        slug: 'home-decor',
        description: 'Decorative home products.',
        attributes: [
            {
                name: 'Material',
                slug: 'decor-material',
                type: 'SELECT',
                scope: 'PRODUCT',
                options: ['Ceramic', 'Glass', 'Wood', 'Metal', 'Stone'],
            },
            {
                name: 'Color',
                slug: 'decor-color',
                type: 'SELECT',
                scope: 'VARIANT',
                options: ['White', 'Black', 'Beige', 'Green', 'Brown'],
            },
        ],
    },
];
