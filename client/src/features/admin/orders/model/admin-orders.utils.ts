export const formatAdminOrderDate = (
    value: string,
    language: string,
): string => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(language, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

export const getAdminOrderCustomerName = (
    firstName: string | null | undefined,
    lastName: string | null | undefined,
    fallback: string,
): string => {
    const name = [firstName, lastName]
        .filter((value): value is string => Boolean(value?.trim()))
        .join(' ')
        .trim();

    return name || fallback;
};

export const getAdminOrderStatusClassName = (
    status: string,
    stylesMap: Record<string, string>,
): string => {
    return stylesMap[`status${status}`] ?? stylesMap.statusDefault;
};

export const getAdminPaymentStatusClassName = (
    status: string,
    stylesMap: Record<string, string>,
): string => {
    return stylesMap[`payment${status}`] ?? stylesMap.paymentDefault;
};
