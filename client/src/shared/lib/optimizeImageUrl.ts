type OptimizeImageOptions = {
    width?: number;
    quality?: number;
};

const DEFAULT_WIDTH = 640;
const DEFAULT_QUALITY = 75;

const isUnsplashUrl = (url: string): boolean => {
    return url.includes('images.unsplash.com');
};

const setUrlParam = (
    params: URLSearchParams,
    key: string,
    value: string | number,
): void => {
    params.set(key, String(value));
};

/**
 * Оптимизирует изображения Unsplash:
 * - ограничивает ширину;
 * - включает WebP;
 * - задаёт качество;
 * - сохраняет остальные параметры URL.
 *
 * Для внешних источников URL возвращается без изменений.
 */
export const optimizeImageUrl = (
    url: string,
    options: OptimizeImageOptions = {},
): string => {
    if (!url) {
        return url;
    }

    if (!isUnsplashUrl(url)) {
        return url;
    }

    const width = options.width ?? DEFAULT_WIDTH;
    const quality = options.quality ?? DEFAULT_QUALITY;

    try {
        const parsedUrl = new URL(url);

        const params = parsedUrl.searchParams;

        setUrlParam(params, 'w', width);
        setUrlParam(params, 'q', quality);
        setUrlParam(params, 'fm', 'webp');

        return parsedUrl.toString();
    } catch {
        return url;
    }
};

/**
 * Создаёт responsive srcSet для изображения.
 *
 * Например:
 * 160w, 240w, 320w, 480w
 */
export const createResponsiveImageSources = (
    url: string,
    widths: number[],
    quality = DEFAULT_QUALITY,
): string => {
    if (!url) {
        return '';
    }

    const uniqueWidths = [...new Set(widths)]
        .filter((width) => Number.isFinite(width) && width > 0)
        .sort((a, b) => a - b);

    if (uniqueWidths.length === 0) {
        return optimizeImageUrl(url, {
            width: DEFAULT_WIDTH,
            quality,
        });
    }

    return uniqueWidths
        .map(
            (width) =>
                `${optimizeImageUrl(url, {
                    width,
                    quality,
                })} ${width}w`,
        )
        .join(', ');
};
