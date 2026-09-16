import { useTranslation } from 'react-i18next';

import { ScrollReveal } from '@/shared/ui/ScrollReveal';

import { BENEFITS } from './benefits.config';
import { DeliveryIcon } from './icons/DeliveryIcon';
import { ReturnsIcon } from './icons/ReturnsIcon';
import { SecureIcon } from './icons/SecureIcon';
import { SupportIcon } from './icons/SupportIcon';

import styles from './BenefitsSection.module.scss';

const BENEFIT_REVEAL_DELAY = 90;

const BENEFIT_ICONS = {
    delivery: DeliveryIcon,
    secure: SecureIcon,
    returns: ReturnsIcon,
    support: SupportIcon,
} as const;

export const BenefitsSection = () => {
    const { t } = useTranslation();

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <ScrollReveal animation="fade-up" duration={750}>
                        <div>
                            <p className={styles.eyebrow}>
                                {t('home.benefits.eyebrow')}
                            </p>

                            <h2 className={styles.title}>
                                {t('home.benefits.title')}
                            </h2>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal
                        animation="fade-left"
                        delay={120}
                        duration={750}
                    >
                        <p className={styles.description}>
                            {t('home.benefits.description')}
                        </p>
                    </ScrollReveal>
                </div>

                <div className={styles.grid}>
                    {BENEFITS.map((benefit, index) => {
                        const Icon = BENEFIT_ICONS[benefit.icon];

                        return (
                            <ScrollReveal
                                key={benefit.id}
                                animation="fade-up"
                                delay={index * BENEFIT_REVEAL_DELAY}
                                duration={800}
                                className={styles.revealItem}
                            >
                                <article className={styles.card}>
                                    <div className={styles.iconWrapper}>
                                        <Icon />
                                    </div>

                                    <div className={styles.content}>
                                        <h3 className={styles.cardTitle}>
                                            {t(
                                                `home.benefits.items.${benefit.id}.title`,
                                            )}
                                        </h3>

                                        <p className={styles.cardDescription}>
                                            {t(
                                                `home.benefits.items.${benefit.id}.description`,
                                            )}
                                        </p>
                                    </div>

                                    <span
                                        className={styles.arrow}
                                        aria-hidden="true"
                                    >
                                        →
                                    </span>
                                </article>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
