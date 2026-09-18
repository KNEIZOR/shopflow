export { getProductBySlug, getProducts } from './api/product-api';

export type {
    GetProductBySlugParams,
    GetProductsParams,
} from './api/product-api';

export {
    createProduct,
    deleteProduct,
    getAdminProductBySlug,
    getAdminProducts,
    updateProduct,
} from './api/product-admin-api';

export type {
    CreateProductInput,
    GetAdminProductParams,
    GetAdminProductsParams,
    UpdateProductInput,
} from './api/product-admin-api';

export {
    deleteProductTranslation,
    getProductTranslation,
    getProductTranslations,
    upsertProductTranslation,
} from './api/product-translations-api';

export type {
    ProductTranslation,
    ProductTranslationsResponse,
    UpsertProductTranslationInput,
} from './api/product-translations-api';

export {
    deleteProductPrice,
    getProductPrice,
    getProductPrices,
    upsertProductPrice,
} from './api/product-prices-api';

export type {
    ProductPrice,
    ProductPricesResponse,
    UpsertProductPriceInput,
} from './api/product-prices-api';

export {
    deleteProductVariantPrice,
    getProductVariantPrice,
    getProductVariantPrices,
    upsertProductVariantPrice,
} from './api/product-variant-prices-api';

export type {
    ProductVariantPrice,
    ProductVariantPricesResponse,
    UpsertProductVariantPriceInput,
} from './api/product-variant-prices-api';

export {
    getProductVariantAttributes,
    createProductVariantAttributeValue,
    updateProductVariantAttributeValue,
    deleteProductVariantAttributeValue,
} from './api/product-variant-attributes-api';

export type {
    ProductVariantAttributeValue,
    ProductVariantAttributesResponse,
    CreateProductVariantAttributeValueInput,
    UpdateProductVariantAttributeValueInput,
} from './api/product-variant-attributes-api';

export type {
    Product,
    ProductCategory,
    ProductImage,
    ProductListResponse,
    ProductStatus,
    ProductVariant,
    ProductType,
} from './model/types';

export { ProductCard, ProductGrid } from './ui';

export {
    createProductVariant,
    deleteProductVariant,
    getProductVariants,
    updateProductVariant,
} from './api/product-variants-api';

export type {
    CreateProductVariantInput,
    ProductVariantsResponse,
    UpdateProductVariantInput,
} from './api/product-variants-api';

export {
    getProductImages,
    createProductImage,
    updateProductImage,
    deleteProductImage,
} from './api/product-images-api';

export type {
    ProductImagesResponse,
    CreateProductImageInput,
    UpdateProductImageInput,
} from './api/product-images-api';

export {
    getProductAttributes,
    createProductAttributeValue,
    deleteProductAttributeValue,
    updateProductAttributeValue,
} from './api/product-attributes-api';

export type {
    CreateProductAttributeValueInput,
    ProductAttributeValue,
    ProductAttributesResponse,
    UpdateProductAttributeValueInput,
} from './api/product-attributes-api';
