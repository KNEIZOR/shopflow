import type { Product } from '../model/types';

import { ProductCard } from './ProductCard';

import styles from './ProductGrid.module.scss';

type ProductGridProps = {
    products: Product[];
};

export const ProductGrid = ({ products }: ProductGridProps) => {
    return (
        <div className={styles.grid}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};
