async function loadProducts() {
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        console.log("Products loaded:", products);
        
        // Find the container where products should go
        const container = document.querySelector('.featured-products, #products-container, main'); 
        // If your product grid has a specific id or class, replace it above. 
        // For now, let's target the area showing the error message:
        const errorMsg = document.querySelector('p'); 
        
        if (products.length > 0) {
            let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 20px;">';
            products.forEach(p => {
                html += `
                    <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #fff;">
                        <h3>${p.title}</h3>
                        <p style="color: #666; font-size: 14px;">${p.description || ''}</p>
                        <p style="font-weight: bold; color: #2ecc71;">$${p.price}</p>
                        <small style="color: #888;">Store: ${p.store_name} (${p.country})</small>
                    </div>
                `;
            });
            html += '</div>';
            
            // Replace the error message with our dynamic product grid
            if (errorMsg) {
                errorMsg.outerHTML = html;
            }
        } else {
            if (errorMsg) {
                errorMsg.textContent = "No products found in the database.";
            }
        }
    } catch (err) {
        console.error('Failed to load products:', err);
    }
}

loadProducts();