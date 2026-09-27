import styles from './CatalogSkeleton.module.scss';

const SKELETON_PRODUCTS = 4;

export const CatalogSkeleton = () => {
    return (
        <div className={styles.skeleton} aria-hidden="true">
            <header className={styles.header}>
                <div className={styles.eyebrow} />

                <div className={styles.title} />

                <div className={styles.description}>
                    <span />
                    <span />
                </div>
            </header>

            <section className={styles.filters}>
                <div className={styles.fieldLarge}>
                    <span className={styles.label} />
                    <span className={styles.control} />
                </div>

                <div className={styles.field}>
                    <span className={styles.label} />
                    <span className={styles.control} />
                </div>

                <div className={styles.priceFields}>
                    <div className={styles.priceField}>
                        <span className={styles.label} />
                        <span className={styles.control} />
                    </div>

                    <div className={styles.priceField}>
                        <span className={styles.label} />
                        <span className={styles.control} />
                    </div>
                </div>

                <div className={styles.field}>
                    <span className={styles.label} />
                    <span className={styles.control} />
                </div>

                <div className={styles.reset} />
            </section>

            <div className={styles.grid}>
                {Array.from({ length: SKELETON_PRODUCTS }, (_, index) => (
                    <article key={index} className={styles.card}>
                        <div className={styles.image} />

                        <div className={styles.category} />

                        <div className={styles.name}>
                            <span />
                            <span />
                        </div>

                        <div className={styles.price} />
                    </article>
                ))}
            </div>
        </div>
    );
};
