document.getElementById('product-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const productData = {
        vendor_id: document.getElementById('vendor_id').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        product_link: document.getElementById('product_link').value,
        image_url: document.getElementById('image_url').value
    };

    try {
        const res = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        const data = await res.json();
        if (res.ok) {
            alert('Product published successfully to LavaSquid!');
            window.location.href = 'index.html';
        } else {
            alert('Error: ' + data.error);
        }
    } catch (err) {
        console.error('Publish error:', err);
        alert('Failed to connect to server.');
    }
});
const payload = {
    vendor_id: document.getElementById('vendor_id').value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: document.getElementById('price').value,
    product_link: document.getElementById('product_link').value,
    image_url: document.getElementById('image_url').value
};
const productData = {
    vendor_id: document.getElementById('vendor_id').value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: document.getElementById('price').value,
    product_link: document.getElementById('product_link').value,
    image_url: document.getElementById('image_url').value
};