import styles from './ReviewStars.module.scss';

type ReviewStarsProps = {
    value: number;
    interactive?: boolean;
    onChange?: (value: number) => void;
    size?: 'small' | 'medium' | 'large';
    label?: string;
};

export const ReviewStars = ({
    value,
    interactive = false,
    onChange,
    size = 'medium',
    label,
}: ReviewStarsProps) => {
    const roundedValue = Math.round(value);

    if (!interactive) {
        return (
            <div
                className={`${styles.stars} ${styles[size]}`}
                aria-label={label}
                role="img"
            >
                {Array.from({ length: 5 }, (_, index) => {
                    const starValue = index + 1;

                    return (
                        <span
                            key={starValue}
                            className={
                                starValue <= roundedValue
                                    ? styles.starActive
                                    : styles.star
                            }
                            aria-hidden="true"
                        >
                            ★
                        </span>
                    );
                })}
            </div>
        );
    }

    return (
        <div
            className={`${styles.stars} ${styles[size]} ${styles.interactive}`}
            aria-label={label}
        >
            {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;

                return (
                    <button
                        key={starValue}
                        type="button"
                        className={
                            starValue <= value
                                ? styles.starButtonActive
                                : styles.starButton
                        }
                        aria-label={`${starValue}/5`}
                        aria-pressed={starValue === value}
                        onClick={() => onChange?.(starValue)}
                    >
                        ★
                    </button>
                );
            })}
        </div>
    );
};
