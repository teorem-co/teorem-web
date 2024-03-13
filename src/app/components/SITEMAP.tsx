export const SITEMAP = () => {
    fetch('http://localhost:8080/sitemap')
        .then((response) => response.text())
        .then((xmlContent) => {
            const blob = new Blob([xmlContent], { type: 'application/xml' });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'sitemap.xml';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });

    return <></>;
};
