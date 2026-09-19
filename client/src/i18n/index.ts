import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import type { LanguageCode } from '@/shared/config/languages';

const STORAGE_KEY = 'shopflow-language';

const savedLanguage = localStorage.getItem(STORAGE_KEY);

const initialLanguage: LanguageCode =
    savedLanguage === 'ru' || savedLanguage === 'en' ? savedLanguage : 'en';

type TranslationModule = Record<string, unknown>;

type BaseResources = {
    common: TranslationModule;
    header: TranslationModule;
    footer: TranslationModule;
};

type AdminFeature =
    | 'auth'
    | 'dashboard'
    | 'categories'
    | 'productTypes'
    | 'products'
    | 'navigation'
    | 'sidebar'
    | 'header';

const loadedLanguages = new Set<LanguageCode>();
const loadedResources = new Set<string>();

const getResourceKey = (language: LanguageCode, resource: string): string =>
    `${language}:${resource}`;

const loadBaseResources = async (
    language: LanguageCode,
): Promise<BaseResources> => {
    const [common, header, footer] = await Promise.all([
        import(`./locales/${language}/common.json`),
        import(`./locales/${language}/header.json`),
        import(`./locales/${language}/footer.json`),
    ]);

    return {
        common: common.default,
        header: header.default,
        footer: footer.default,
    };
};

const loadBaseLanguage = async (language: LanguageCode): Promise<void> => {
    if (loadedLanguages.has(language)) {
        return;
    }

    const resources = await loadBaseResources(language);

    i18n.addResourceBundle(
        language,
        'translation',
        {
            common: resources.common,
            header: resources.header,
            footer: resources.footer,
        },
        true,
        true,
    );

    loadedResources.add(getResourceKey(language, 'common'));
    loadedResources.add(getResourceKey(language, 'header'));
    loadedResources.add(getResourceKey(language, 'footer'));

    loadedLanguages.add(language);
};

const addTopLevelResource = (
    language: LanguageCode,
    resourceName: string,
    resource: TranslationModule,
): void => {
    i18n.addResourceBundle(
        language,
        'translation',
        {
            [resourceName]: resource,
        },
        true,
        true,
    );

    loadedResources.add(getResourceKey(language, resourceName));
};

const addAdminResource = (
    language: LanguageCode,
    resourceName: AdminFeature,
    resource: TranslationModule,
): void => {
    i18n.addResourceBundle(
        language,
        'translation',
        {
            admin: {
                [resourceName]: resource,
            },
        },
        true,
        true,
    );

    loadedResources.add(getResourceKey(language, `admin.${resourceName}`));
};

export const loadHomeTranslations = async (
    language: LanguageCode,
): Promise<void> => {
    const key = getResourceKey(language, 'home');

    if (loadedResources.has(key)) {
        return;
    }

    const { default: home } = await import(`./locales/${language}/home.json`);

    addTopLevelResource(language, 'home', home);
};

export const loadCatalogTranslations = async (
    language: LanguageCode,
): Promise<void> => {
    const key = getResourceKey(language, 'catalog');

    if (loadedResources.has(key)) {
        return;
    }

    const { default: catalog } = await import(
        `./locales/${language}/catalog.json`
    );

    addTopLevelResource(language, 'catalog', catalog);
};

export const loadProductTranslations = async (
    language: LanguageCode,
): Promise<void> => {
    const key = getResourceKey(language, 'product');

    if (loadedResources.has(key)) {
        return;
    }

    const { default: product } = await import(
        `./locales/${language}/product.json`
    );

    addTopLevelResource(language, 'product', product);
};

export const loadCartTranslations = async (
    language: LanguageCode,
): Promise<void> => {
    const key = getResourceKey(language, 'cart');

    if (loadedResources.has(key)) {
        return;
    }

    const { default: cart } = await import(`./locales/${language}/cart.json`);

    addTopLevelResource(language, 'cart', cart);
};

export const loadNotFoundTranslations = async (
    language: LanguageCode,
): Promise<void> => {
    const key = getResourceKey(language, 'not-found');

    if (loadedResources.has(key)) {
        return;
    }

    const { default: notFound } = await import(
        `./locales/${language}/not-found.json`
    );

    addTopLevelResource(language, 'notFound', notFound);
};

const adminLoaders: Record<
    AdminFeature,
    (language: LanguageCode) => Promise<{
        default: TranslationModule;
    }>
> = {
    auth: (language) => import(`./locales/${language}/admin/auth.json`),

    dashboard: (language) =>
        import(`./locales/${language}/admin/dashboard.json`),

    categories: (language) =>
        import(`./locales/${language}/admin/categories.json`),

    productTypes: (language) =>
        import(`./locales/${language}/admin/product-types.json`),

    products: (language) => import(`./locales/${language}/admin/products.json`),

    navigation: (language) =>
        import(`./locales/${language}/admin/navigation.json`),

    sidebar: (language) => import(`./locales/${language}/admin/sidebar.json`),

    header: (language) => import(`./locales/${language}/admin/header.json`),
};

export const loadAdminFeatureTranslations = async (
    language: LanguageCode,
    feature: AdminFeature,
): Promise<void> => {
    const resourceName = `admin.${feature}`;

    const key = getResourceKey(language, resourceName);

    if (loadedResources.has(key)) {
        return;
    }

    const { default: resource } = await adminLoaders[feature](language);

    addAdminResource(language, feature, resource);
};

const loadAllFeatureTranslations = async (
    language: LanguageCode,
): Promise<void> => {
    await Promise.all([
        loadHomeTranslations(language),
        loadCatalogTranslations(language),
        loadProductTranslations(language),
        loadCartTranslations(language),
        loadNotFoundTranslations(language),

        loadAdminFeatureTranslations(language, 'auth'),
        loadAdminFeatureTranslations(language, 'dashboard'),
        loadAdminFeatureTranslations(language, 'categories'),
        loadAdminFeatureTranslations(language, 'productTypes'),
        loadAdminFeatureTranslations(language, 'products'),
        loadAdminFeatureTranslations(language, 'navigation'),
        loadAdminFeatureTranslations(language, 'sidebar'),
        loadAdminFeatureTranslations(language, 'header'),
    ]);
};

const initialResources = await loadBaseResources(initialLanguage);

void i18n.use(initReactI18next).init({
    resources: {
        [initialLanguage]: {
            translation: {
                common: initialResources.common,
                header: initialResources.header,
                footer: initialResources.footer,
            },
        },
    },

    lng: initialLanguage,

    fallbackLng: 'en',

    interpolation: {
        escapeValue: false,
    },
});

loadedLanguages.add(initialLanguage);

loadedResources.add(getResourceKey(initialLanguage, 'common'));

loadedResources.add(getResourceKey(initialLanguage, 'header'));

loadedResources.add(getResourceKey(initialLanguage, 'footer'));

export const changeLanguage = async (language: LanguageCode): Promise<void> => {
    if (language === i18n.language) {
        return;
    }

    await loadBaseLanguage(language);
    await loadAllFeatureTranslations(language);
    await i18n.changeLanguage(language);

    localStorage.setItem(STORAGE_KEY, language);
};

export const ensureLanguageLoaded = async (
    language: LanguageCode,
): Promise<void> => {
    await loadBaseLanguage(language);
};

export default i18n;
