import {
    PrismaClient,
    ProductAttributeScope,
    ProductAttributeType,
} from '@prisma/client';

const prisma = new PrismaClient();

type AttributeOptionSeed = {
    value: string;
    label?: string;
};

type AttributeSeed = {
    name: string;
    slug: string;
    description?: string;
    type: ProductAttributeType;
    scope: ProductAttributeScope;
    required?: boolean;
    options?: AttributeOptionSeed[];
};

type ProductTypeSeed = {
    name: string;
    slug: string;
    description: string;
    attributes: AttributeSeed[];
};

const option = (value: string, label = value): AttributeOptionSeed => ({
    value,
    label,
});

const PRODUCT_TYPES: ProductTypeSeed[] = [
    {
        name: 'Smartphone',
        slug: 'smartphone',
        description: 'Mobile smartphones and cellular devices.',
        attributes: [
            {
                name: 'Screen Size',
                slug: 'screen-size',
                description: 'Display diagonal size in inches.',
                type: ProductAttributeType.NUMBER,
                scope: ProductAttributeScope.PRODUCT,
                required: true,
            },
            {
                name: 'Processor',
                slug: 'processor',
                description: 'Main processor or chipset.',
                type: ProductAttributeType.TEXT,
                scope: ProductAttributeScope.PRODUCT,
                required: true,
            },
            {
                name: 'Camera',
                slug: 'camera',
                description: 'Main camera specification.',
                type: ProductAttributeType.TEXT,
                scope: ProductAttributeScope.PRODUCT,
            },
            {
                name: '5G',
                slug: '5g',
                description: 'Whether the device supports 5G connectivity.',
                type: ProductAttributeType.BOOLEAN,
                scope: ProductAttributeScope.PRODUCT,
            },
            {
                name: 'RAM',
                slug: 'ram',
                description: 'Amount of RAM.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.VARIANT,
                required: true,
                options: [
                    option('4 GB'),
                    option('6 GB'),
                    option('8 GB'),
                    option('12 GB'),
                    option('16 GB'),
                ],
            },
            {
                name: 'Storage',
                slug: 'storage',
                description: 'Internal storage capacity.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.VARIANT,
                required: true,
                options: [
                    option('64 GB'),
                    option('128 GB'),
                    option('256 GB'),
                    option('512 GB'),
                    option('1 TB'),
                ],
            },
            {
                name: 'Color',
                slug: 'color',
                description: 'Product color.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.VARIANT,
                required: true,
                options: [
                    option('Black'),
                    option('White'),
                    option('Silver'),
                    option('Gray'),
                    option('Blue'),
                    option('Green'),
                    option('Red'),
                ],
            },
        ],
    },

    {
        name: 'Laptop',
        slug: 'laptop',
        description: 'Laptops and portable computers.',
        attributes: [
            {
                name: 'Screen Size',
                slug: 'screen-size',
                description: 'Display diagonal size in inches.',
                type: ProductAttributeType.NUMBER,
                scope: ProductAttributeScope.PRODUCT,
                required: true,
            },
            {
                name: 'Processor',
                slug: 'processor',
                description: 'Main processor model.',
                type: ProductAttributeType.TEXT,
                scope: ProductAttributeScope.PRODUCT,
                required: true,
            },
            {
                name: 'Graphics',
                slug: 'graphics',
                description: 'Graphics processor or GPU.',
                type: ProductAttributeType.TEXT,
                scope: ProductAttributeScope.PRODUCT,
            },
            {
                name: 'RAM',
                slug: 'ram',
                description: 'Amount of RAM.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.VARIANT,
                required: true,
                options: [
                    option('8 GB'),
                    option('16 GB'),
                    option('32 GB'),
                    option('64 GB'),
                ],
            },
            {
                name: 'Storage',
                slug: 'storage',
                description: 'Internal storage capacity.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.VARIANT,
                required: true,
                options: [
                    option('256 GB'),
                    option('512 GB'),
                    option('1 TB'),
                    option('2 TB'),
                ],
            },
            {
                name: 'Color',
                slug: 'color',
                description: 'Laptop color.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.VARIANT,
                options: [
                    option('Black'),
                    option('Silver'),
                    option('Gray'),
                    option('White'),
                    option('Blue'),
                ],
            },
        ],
    },

    {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Clothing and apparel.',
        attributes: [
            {
                name: 'Material',
                slug: 'material',
                description: 'Main material of the product.',
                type: ProductAttributeType.TEXT,
                scope: ProductAttributeScope.PRODUCT,
                required: true,
            },
            {
                name: 'Gender',
                slug: 'gender',
                description: 'Target gender.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.PRODUCT,
                options: [
                    option('Men'),
                    option('Women'),
                    option('Unisex'),
                    option('Kids'),
                ],
            },
            {
                name: 'Season',
                slug: 'season',
                description: 'Recommended season.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.PRODUCT,
                options: [
                    option('Spring'),
                    option('Summer'),
                    option('Autumn'),
                    option('Winter'),
                    option('All Season'),
                ],
            },
            {
                name: 'Size',
                slug: 'size',
                description: 'Clothing size.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.VARIANT,
                required: true,
                options: [
                    option('XS'),
                    option('S'),
                    option('M'),
                    option('L'),
                    option('XL'),
                    option('XXL'),
                ],
            },
            {
                name: 'Color',
                slug: 'color',
                description: 'Clothing color.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.VARIANT,
                required: true,
                options: [
                    option('Black'),
                    option('White'),
                    option('Gray'),
                    option('Blue'),
                    option('Red'),
                    option('Green'),
                    option('Beige'),
                ],
            },
        ],
    },

    {
        name: 'Shoes',
        slug: 'shoes',
        description: 'Shoes and footwear.',
        attributes: [
            {
                name: 'Material',
                slug: 'material',
                description: 'Main material of the footwear.',
                type: ProductAttributeType.TEXT,
                scope: ProductAttributeScope.PRODUCT,
                required: true,
            },
            {
                name: 'Gender',
                slug: 'gender',
                description: 'Target gender.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.PRODUCT,
                options: [
                    option('Men'),
                    option('Women'),
                    option('Unisex'),
                    option('Kids'),
                ],
            },
            {
                name: 'Season',
                slug: 'season',
                description: 'Recommended season.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.PRODUCT,
                options: [
                    option('Spring'),
                    option('Summer'),
                    option('Autumn'),
                    option('Winter'),
                    option('All Season'),
                ],
            },
            {
                name: 'Size',
                slug: 'size',
                description: 'Shoe size.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.VARIANT,
                required: true,
                options: [
                    option('36'),
                    option('37'),
                    option('38'),
                    option('39'),
                    option('40'),
                    option('41'),
                    option('42'),
                    option('43'),
                    option('44'),
                    option('45'),
                    option('46'),
                ],
            },
            {
                name: 'Color',
                slug: 'color',
                description: 'Shoe color.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.VARIANT,
                required: true,
                options: [
                    option('Black'),
                    option('White'),
                    option('Gray'),
                    option('Blue'),
                    option('Brown'),
                    option('Beige'),
                ],
            },
        ],
    },

    {
        name: 'Monitor',
        slug: 'monitor',
        description: 'Computer monitors and displays.',
        attributes: [
            {
                name: 'Screen Size',
                slug: 'screen-size',
                description: 'Display diagonal size in inches.',
                type: ProductAttributeType.NUMBER,
                scope: ProductAttributeScope.PRODUCT,
                required: true,
            },
            {
                name: 'Resolution',
                slug: 'resolution',
                description: 'Native display resolution.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.PRODUCT,
                required: true,
                options: [
                    option('1920x1080'),
                    option('2560x1440'),
                    option('3440x1440'),
                    option('3840x2160'),
                    option('5120x2880'),
                ],
            },
            {
                name: 'Panel Type',
                slug: 'panel-type',
                description: 'Display panel technology.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.PRODUCT,
                options: [
                    option('IPS'),
                    option('VA'),
                    option('OLED'),
                    option('Mini LED'),
                    option('TN'),
                ],
            },
            {
                name: 'Refresh Rate',
                slug: 'refresh-rate',
                description: 'Maximum display refresh rate.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.PRODUCT,
                options: [
                    option('60 Hz'),
                    option('75 Hz'),
                    option('120 Hz'),
                    option('144 Hz'),
                    option('165 Hz'),
                    option('240 Hz'),
                    option('360 Hz'),
                ],
            },
            {
                name: 'Color',
                slug: 'color',
                description: 'Monitor color.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.VARIANT,
                options: [
                    option('Black'),
                    option('White'),
                    option('Gray'),
                    option('Silver'),
                ],
            },
        ],
    },

    {
        name: 'Headphones',
        slug: 'headphones',
        description: 'Headphones, earbuds and audio devices.',
        attributes: [
            {
                name: 'Type',
                slug: 'headphone-type',
                description: 'Headphone form factor.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.PRODUCT,
                required: true,
                options: [
                    option('In-Ear'),
                    option('On-Ear'),
                    option('Over-Ear'),
                    option('True Wireless'),
                ],
            },
            {
                name: 'Connection',
                slug: 'connection',
                description: 'Primary connection type.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.PRODUCT,
                options: [
                    option('Bluetooth'),
                    option('USB-C'),
                    option('3.5mm'),
                    option('Wireless'),
                ],
            },
            {
                name: 'Noise Cancellation',
                slug: 'noise-cancellation',
                description: 'Whether active noise cancellation is supported.',
                type: ProductAttributeType.BOOLEAN,
                scope: ProductAttributeScope.PRODUCT,
            },
            {
                name: 'Battery Life',
                slug: 'battery-life',
                description: 'Approximate battery life in hours.',
                type: ProductAttributeType.NUMBER,
                scope: ProductAttributeScope.PRODUCT,
            },
            {
                name: 'Color',
                slug: 'color',
                description: 'Headphone color.',
                type: ProductAttributeType.SELECT,
                scope: ProductAttributeScope.VARIANT,
                options: [
                    option('Black'),
                    option('White'),
                    option('Gray'),
                    option('Silver'),
                    option('Blue'),
                ],
            },
        ],
    },
];

const createOrUpdateAttribute = async (attributeData: AttributeSeed) => {
    return prisma.productAttribute.upsert({
        where: {
            slug: attributeData.slug,
        },
        update: {
            name: attributeData.name,
            description: attributeData.description,
            type: attributeData.type,
            scope: attributeData.scope,
        },
        create: {
            name: attributeData.name,
            slug: attributeData.slug,
            description: attributeData.description,
            type: attributeData.type,
            scope: attributeData.scope,
        },
    });
};

const syncAttributeOptions = async (
    productTypeAttributeId: string,
    options: AttributeOptionSeed[],
) => {
    const existingOptions = await prisma.productAttributeOption.findMany({
        where: {
            productTypeAttributeId,
        },
        select: {
            id: true,
            value: true,
        },
    });

    const configuredValues = new Set(options.map((item) => item.value));

    const optionsToDelete = existingOptions.filter(
        (existingOption) => !configuredValues.has(existingOption.value),
    );

    if (optionsToDelete.length > 0) {
        await prisma.productAttributeOption.deleteMany({
            where: {
                id: {
                    in: optionsToDelete.map((item) => item.id),
                },
            },
        });
    }

    for (let index = 0; index < options.length; index += 1) {
        const optionData = options[index];

        await prisma.productAttributeOption.upsert({
            where: {
                productTypeAttributeId_value: {
                    productTypeAttributeId,
                    value: optionData.value,
                },
            },
            update: {
                label: optionData.label ?? optionData.value,
                position: index,
            },
            create: {
                productTypeAttributeId,
                value: optionData.value,
                label: optionData.label ?? optionData.value,
                position: index,
            },
        });
    }
};

const syncProductTypeAttribute = async (
    productTypeId: string,
    attributeData: AttributeSeed,
    position: number,
) => {
    const attribute = await createOrUpdateAttribute(attributeData);

    const productTypeAttribute = await prisma.productTypeAttribute.upsert({
        where: {
            productTypeId_attributeId: {
                productTypeId,
                attributeId: attribute.id,
            },
        },
        update: {
            isRequired: attributeData.required ?? false,
            position,
        },
        create: {
            productTypeId,
            attributeId: attribute.id,
            isRequired: attributeData.required ?? false,
            position,
        },
    });

    await syncAttributeOptions(
        productTypeAttribute.id,
        attributeData.options ?? [],
    );

    return productTypeAttribute;
};

const syncProductType = async (productTypeData: ProductTypeSeed) => {
    const productType = await prisma.productType.upsert({
        where: {
            slug: productTypeData.slug,
        },
        update: {
            name: productTypeData.name,
            description: productTypeData.description,
        },
        create: {
            name: productTypeData.name,
            slug: productTypeData.slug,
            description: productTypeData.description,
        },
    });

    const configuredAttributeSlugs = new Set(
        productTypeData.attributes.map((attribute) => attribute.slug),
    );

    const existingRelations = await prisma.productTypeAttribute.findMany({
        where: {
            productTypeId: productType.id,
        },
        include: {
            attribute: {
                select: {
                    slug: true,
                },
            },
        },
    });

    const relationsToDelete = existingRelations.filter(
        (relation) => !configuredAttributeSlugs.has(relation.attribute.slug),
    );

    if (relationsToDelete.length > 0) {
        await prisma.productTypeAttribute.deleteMany({
            where: {
                id: {
                    in: relationsToDelete.map((relation) => relation.id),
                },
            },
        });
    }

    for (let index = 0; index < productTypeData.attributes.length; index += 1) {
        await syncProductTypeAttribute(
            productType.id,
            productTypeData.attributes[index],
            index,
        );
    }

    return productType;
};

const main = async () => {
    console.log('Starting ShopFlow product catalog seed...');

    for (const productTypeData of PRODUCT_TYPES) {
        const productType = await syncProductType(productTypeData);

        console.log(`✓ ${productType.name} synced`);
    }

    console.log(`Successfully synced ${PRODUCT_TYPES.length} product types.`);
};

main()
    .catch((error) => {
        console.error('Product catalog seed failed:', error);

        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
