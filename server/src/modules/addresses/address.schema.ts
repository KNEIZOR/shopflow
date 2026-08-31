import { z } from 'zod';

const nameSchema = z.string().trim().min(1, 'Required').max(100);

const phoneSchema = z
    .string()
    .trim()
    .min(5, 'Invalid phone number')
    .max(30, 'Invalid phone number');

const countrySchema = z.string().trim().min(2).max(100);
const citySchema = z.string().trim().min(1).max(100);
const postalCodeSchema = z.string().trim().min(2).max(20);
const streetSchema = z.string().trim().min(1).max(200);

export const createAddressSchema = z.object({
    firstName: nameSchema,
    lastName: nameSchema,
    phone: phoneSchema,
    country: countrySchema,
    city: citySchema,
    postalCode: postalCodeSchema,
    street: streetSchema,
    apartment: z.string().trim().max(50).optional(),
});

export const updateAddressSchema = createAddressSchema.partial();
export const addressIdParamsSchema = z.object({
    addressId: z.string().cuid('Invalid address ID'),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type AddressIdParams = z.infer<typeof addressIdParamsSchema>;
