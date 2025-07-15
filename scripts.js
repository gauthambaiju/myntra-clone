const sortBy = document.querySelector(
    ".desktop-container main .content-row-3 .right-container .sort-container .sort-by"
);
const sortList = document.querySelector(
    ".desktop-container main .content-row-3 .right-container .sort-container .sort-list"
);
const sortingCriteriaLabel = document.querySelector(
    ".desktop-container main .content-row-3 .right-container .sort-container .sort-by .sorting-criteria-label"
);
const sortingCriteria = document.querySelectorAll(
    ".desktop-container main .content-row-3 .right-container .sort-container .sort-list li"
);
const cardContainer = document.querySelector(
    ".desktop-container main .content-row-3 .cards-container .cards-container-inner"
);

sortBy.addEventListener("mouseenter", () => {
    sortList.style.display = "block";
});
sortBy.addEventListener("mouseleave", () => {
    sortList.style.display = "none";
});

let displayData = [];
let displayDataCopy = [];

let firstPart = ``;
const lastPart = `<li class="card"></li>
                <li class="card"></li>
                <li class="card"></li>`;

(async function () {
    try {
        const response = await fetch("data.json");
        data = await response.json();
    } catch (err) {
        console.error(err);
    }
    displayData = [...data];
    displayDataCopy = [...data];

    function setDisplayData() {
        for (let productDetails of displayData) {
            let {
                rating,
                ratingsCount,
                imagePath,
                productBrand,
                productName,
                discountedPrice,
                originalPrice,
                discountPercentage,
                additionalInfo,
            } = productDetails;

            if (ratingsCount >= 1000) {
                ratingsCount = `${Math.round(ratingsCount / 100) / 10}k`;
            }

            firstPart += `<li class="card">
                            <div class="ratings-container">
                                <span>${rating}</span>
                                <span class="star-icon"></span>
                                <div class="ratings-count">
                                    <div class="bar">|</div>
                                    ${ratingsCount}
                                </div>
                            </div>
                            <div class="ad"> AD </div>
                            <a class="contents">
                                <div class="img-container">
                                    <img src="${imagePath}" alt="">
                                </div>
                                <div class="info-wrapper">
                                    <h3 class="product-brand">${productBrand}</h3>
                                    <h4 class="product-name">${productName}</h4>
                                    <div class="price-container">
                                        <span><span class="discounted-price">Rs. ${discountedPrice}</span><span class="original-price">Rs. ${originalPrice}</span></span><span class="discount-percentage">(${discountPercentage}% OFF)</span>
                                    </div>
                                    ${
                                        additionalInfo
                                            ? `<div class="additional-info">Only Few Left!</div>`
                                            : ``
                                    }
                                </div>
                            </a>
                        </li>`;
        }
    }

    function sortDisplayData(criteria) {
        switch (criteria) {
            case "Price: Low to High":
                displayData.sort((a, b) => {
                    return a.discountedPrice - b.discountedPrice;
                });
                break;
            case "Price: High to Low":
                displayData.sort((a, b) => {
                    return b.discountedPrice - a.discountedPrice;
                });
                break;
            case "Customer Rating":
                displayData.sort((a, b) => {
                    return b.rating - a.rating;
                });
                break;
            case "Better Discount":
                displayData.sort((a, b) => {
                    return b.discountPercentage - a.discountPercentage;
                });
                break;
            case "Popularity":
                displayData.sort((a, b) => {
                    return b.ratingsCount - a.ratingsCount;
                });
                break;
            case "What's New":
                displayData.sort((a, b) => {
                    return b.createdAt - a.createdAt;
                });
                break;
            default:
                displayData = [...displayDataCopy];
        }
    }

    function updateDisplayData() {
        firstPart = ``;
        setDisplayData();
        cardContainer.innerHTML = `${firstPart}${lastPart}`;
    }

    updateDisplayData();

    sortingCriteria.forEach((item) => {
        item.addEventListener("click", () => {
            const criteria = item.textContent.trim();
            sortingCriteriaLabel.textContent = `${criteria}`;
            sortDisplayData(criteria);
            updateDisplayData();
        });
    });
})();
