import type { Product } from '../model/types';

import { ProductCard } from './ProductCard';

import styles from './ProductGrid.module.scss';

type ProductGridProps = {
    products: Product[];
};

const PRIORITY_PRODUCT_COUNT = 4;

export const ProductGrid = ({ products }: ProductGridProps) => {
    return (
        <div className={styles.grid}>
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    priority={index < PRIORITY_PRODUCT_COUNT}
                />
            ))}
        </div>
    );
};
