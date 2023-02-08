export const mapSelectOptions = (data: any) => {
    return data.map((x: any) => {
        return {
            value: x.id ? x.id : '',
            label: x.name,
        };
    });
};
