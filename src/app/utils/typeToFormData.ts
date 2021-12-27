const typeToFormData = (type: any) => {
    let formData = new FormData();

    for (const value in type) {
        formData.append(value, type[value])
    }

    return formData;
}

export default typeToFormData;