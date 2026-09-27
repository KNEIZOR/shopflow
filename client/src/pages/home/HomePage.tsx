import { HeroSection } from './ui/HeroSection/HeroSection';
import { LazyHomeSection } from './ui/LazyHomeSection/LazyHomeSection';

import styles from './HomePage.module.scss';

const loadCategoriesSection = () =>
    import('./ui/CategoriesSection/CategoriesSection').then(
        ({ CategoriesSection }) => ({
            default: CategoriesSection,
        }),
    );

const loadNewProductsSection = () =>
    import('./ui/NewProductsSection/NewProductsSection').then(
        ({ NewProductsSection }) => ({
            default: NewProductsSection,
        }),
    );

const loadBenefitsSection = () =>
    import('./ui/BenefitsSection/BenefitsSection').then(
        ({ BenefitsSection }) => ({
            default: BenefitsSection,
        }),
    );

const loadCatalogCtaSection = () =>
    import('./ui/CatalogCtaSection/CatalogCtaSection').then(
        ({ CatalogCtaSection }) => ({
            default: CatalogCtaSection,
        }),
    );

export const HomePage = () => {
    return (
        <main className={styles.homePage}>
            <HeroSection />

            <LazyHomeSection loader={loadCategoriesSection} />

            <LazyHomeSection loader={loadNewProductsSection} />

            <LazyHomeSection loader={loadBenefitsSection} />

            <LazyHomeSection loader={loadCatalogCtaSection} />
        </main>
    );
};
