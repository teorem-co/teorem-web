const typeToFormData = (type: any) => {
    const formData = new FormData();

    for (const value in type) {
        formData.append(value, type[value]);
    }

    return formData;
};

export default typeToFormData;
