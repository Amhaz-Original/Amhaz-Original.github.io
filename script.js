const productList = document.getElementById('product-list');
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const clearBtn = document.getElementById('clear-btn'); // Get the Clear button
const categorySelect = document.getElementById('category-select');
const header = document.querySelector('header');
const main = document.querySelector('main');
const noResultsMessage = document.getElementById('no-results-message'); // Get the no results message

// Initially hide the Clear button and the no results message
clearBtn.style.display = 'none';
noResultsMessage.style.display = 'none';

// Function to display products
function displayProducts(productsToDisplay) {
    productList.innerHTML = ''; // Clear previous items
    productsToDisplay.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');

        productItem.innerHTML = `
            <div class="product-name">${product.Product}</div>
            <div class="product-price">${product.Price}</div>
        `;

        productList.appendChild(productItem);
    });
}

// Fetch product data from the appropriate JSON file
function fetchProducts(category, searchQuery) {
    let jsonFile = category === 'new' ? 'data/New Products.json' : 'data/Open Box.json';

    fetch(jsonFile)
        .then(response => response.json())
        .then(products => {
            const filteredProducts = products.filter(product =>
                product.Product.toLowerCase().includes(searchQuery.toLowerCase())
            );

            // If no results, show the message and keep the search bar partially centered
            if (filteredProducts.length === 0) {
                noResultsMessage.style.display = 'block'; // Show the message
                setTimeout(() => {
                    noResultsMessage.style.opacity = '1'; // Animate opacity
                }, 10); // Small delay for the fade-in effect
                header.classList.add('shrink-no-results'); // Move the search bar only slightly
                clearBtn.style.display = 'inline-block'; // Show the Clear button
            } else {
                noResultsMessage.style.opacity = '0'; // Fade out message
                setTimeout(() => {
                    noResultsMessage.style.display = 'none'; // Hide it after fade-out
                }, 500); // Same duration as CSS transition
                header.classList.add('shrink'); // Move search bar up normally
            }

            displayProducts(filteredProducts);
            main.classList.add('active'); // Show results area

            // Show the Clear button if results are displayed
            if (filteredProducts.length > 0) {
                clearBtn.style.display = 'inline-block'; // Show the Clear button
            } else {
                clearBtn.style.display = 'inline-block'; // Show the Clear button even when no results
            }
        })
        .catch(error => {
            console.error('Error fetching the products data:', error);
        });
}

// Search button functionality
searchBtn.addEventListener('click', () => {
    const category = categorySelect.value;
    const searchQuery = searchBar.value.trim();

    if (searchQuery) {
        fetchProducts(category, searchQuery);
    }
});

// Enter key functionality for search
searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Clear button functionality to reset the page
clearBtn.addEventListener('click', () => {
    // Clear the search bar and product list
    searchBar.value = '';
    productList.innerHTML = '';

    // Hide the results area and move the search bar back to the center
    main.classList.remove('active');
    header.classList.remove('shrink', 'shrink-no-results'); // Remove both shrink classes

    // Hide the Clear button and no results message
    clearBtn.style.display = 'none';
    noResultsMessage.style.display = 'none';
});
