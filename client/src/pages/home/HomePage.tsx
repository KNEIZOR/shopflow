import { BenefitsSection } from './ui/BenefitsSection/BenefitsSection';
import { CatalogCtaSection } from './ui/CatalogCtaSection/CatalogCtaSection';
import { CategoriesSection } from './ui/CategoriesSection/CategoriesSection';
import { HeroSection } from './ui/HeroSection/HeroSection';
import { NewProductsSection } from './ui/NewProductsSection/NewProductsSection';

import styles from './HomePage.module.scss';

export const HomePage = () => {
    return (
        <main className={styles.homePage}>
            <HeroSection />
            <CategoriesSection />
            <NewProductsSection />
            <BenefitsSection />
            <CatalogCtaSection />
        </main>
    );
};
