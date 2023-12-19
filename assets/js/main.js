const userId = localStorage.getItem('userId');
if(userId) {
    const accListElement = document.querySelector('#header .acc-list');
    accListElement.innerHTML = `
        <ul>
        <li>
            <a href="#">
                <span>Trang cá nhân</span>
            </a>
        </li>
        <li>
            <a href="/dang-xuat" onclick="dangXuat(event)">
                <span>Đăng xuất</span>
            </a>
        </li>
        </ul>
    `;
}

// Đăng xuất user
function dangXuat(event) {
    event.preventDefault();
    localStorage.removeItem('userId');
    window.location.href = '/';
}

// Fetch categories dữ liệu từ API
async function getCategories() {
    const url = 'https://localhost:44360/api/Category/GetAllCategories';
    const res = await fetch(url);
    const data = await res.json();

    displayCategory(data);
}

// Hiển thị categories
function displayCategory(categories) {
    const bottomHeader = document.querySelector('#header .bottom-header .list-menu-row');
    categories.$values.forEach(category => {
        let col = `
            <div class="col list-menu-member">
                <div class="col-heading">
                    <a class="col-header" href="">${category.Name}</a>
                </div>
                <ul class="d-inline list-sub-category">
        `;

        category.Subcategories.$values.forEach(subcategory => {
            const liItem = `
                <li><a href="">${subcategory.Name}</a></li>
            `;

            col += liItem;
        });
        col += '</ul></div>';

        bottomHeader.innerHTML += col;
    });
}

// Fetch category new product dữ liệu từ API
async function getCategoryNew() {
    const url = 'https://localhost:44360/api/Category/GetAllCategoriesHome';
    const res = await fetch(url);
    const data = await res.json();
    displayCategoryNew(data.$values);
}

// Xử lý sự kiện click category add class current
function handleActiveClickedCategory(event) {
    const textActive = event.target.textContent.trim();

    const lstCategories = document.querySelectorAll('#new-product .swiper-wrapper-scroll .tab-link');
    lstCategories.forEach(category => {
        // Add class current cho category được click
        if(category.textContent.trim() == textActive) {
            category.classList.add('current');
        } else {
            category.classList.remove('current');
        }
    });
}

// Hiển thị category new product
function displayCategoryNew(categories) {
    const categoryNew = document.querySelector('#new-product .swiper-wrapper-scroll');
    categories.forEach(category => {
        const html = `
            <div class="swiper-slide swiper-slide-active" style="width: 216px; margin-right: 15px;">
                <div class="tab-link item">
                <div class="title-tab" data-id="${category.Id}">
                    ${category.Name}
                </div>
                </div>
            </div>
        `;
        categoryNew.innerHTML += html;
    });
    
    // xử lý sự kiện click category
    const categoryLinks = document.querySelectorAll('#new-product .swiper-wrapper-scroll .title-tab');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            handleActiveClickedCategory(e);
            const categoryId = e.target.dataset.id;
            if(categoryId) {
                getProductsByCategory(categoryId);
            } else {
                var products = getProductsNew();
                displayProductsNew(products);
            }
        });
    });
}

// Fetch products by category dữ liệu từ API
async function getProductsByCategory(categoryId) {
    // Hiển thị loader
    const loaderElement = document.querySelector('#new-product .loader-container');
    loaderElement.style.display = 'block';
    // Lấy dữ liệu từ API
    const url = `https://localhost:44360/api/Product/GetProductByCategory/${categoryId}`;
    const res = await fetch(url);
    const data = await res.json();
    // Hiển thị products by category
    displayProductsNew(data.$values)
    // Ẩn loader
    loaderElement.style.display = 'none';
}

// Fetch products dữ liệu từ API
async function getProductsNew() {
    // Hiển thị loader
    const loaderElement = document.querySelector('#new-product .loader-container');
    loaderElement.style.display = 'block';
    // Lấy dữ liệu từ API
    const url = 'https://localhost:44360/api/Product/GetProductsNew';
    const res = await fetch(url);
    const data = await res.json();
    // Hiển thị products new
    displayProductsNew(data.$values);
    // Ẩn loader
    loaderElement.style.display = 'none';
}

// Hiển thị products new
function displayProductsNew(products) {
    const productNewRoot = document.querySelector('#new-product .product-new');
    productNewRoot.innerHTML = '';
    products.forEach(product => {
        const html = `
            <div class="item_product_main swiper-slide swiper-slide-active" style="width: 250px; margin-right: 15px;">
                <div class="product-thumbnail">
                    <a href="${product.Name}" data-id="${product.Id}" class="image_thumb product-link" title="${product.Name}">
                        <img width="300" height="300" src="${product.DefaultImage}" alt="${product.Name}">
                    </a>
                </div>
                <div class="product-info">
                    <h3 class="product-name">
                        <a href="${product.Name}" data-id="${product.Id}" class="product-link" title="${product.Name}">${product.Name}</a>
                    </h3>
                    <div class="price-box">
                        <span class="price">${product.PriceNew} ₫</span>
                    </div>
                </div>
            </div>
        `;
        productNewRoot.innerHTML += html;
    });
    // Xử lý sự kiện click product
    const productLinks = document.querySelectorAll('#new-product .product-new .product-link');
    productLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Lưu productId vào localStorage, rediction tới trang productDetail.html
            const productId = link.dataset.id;
            window.localStorage.setItem('proId', productId);
            window.location.href = '/views/productDetail.html';
        });
    })
}

getCategories();
getCategoryNew();
getProductsNew();