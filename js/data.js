document.addEventListener('DOMContentLoaded', () => {
    const selectedItem = localStorage.getItem('selectedItem');

    if (selectedItem) {
        const item = JSON.parse(selectedItem);

        console.log(item);

        const html = `
            <div class="main-container ">
                <div class="flex">
                    <img class="left-indicator" src="./img/left.indicator.svg" alt="left">
                    <img class="img-item object-cover max-w-[200px] cover" src="${item.photo}" alt="" data-index="0">
                    <img class="right-indicator" src="./img/right.indicator.svg" alt="right">
                </div>
                <div class="img-block flex items-center p-4 gap-2"></div>
            </div>
        `;

        document.getElementById('dataContainer').innerHTML = html;

        const imgBlock = document.querySelector(".img-block");
        const mainImage = document.querySelector(".img-item");

        item.photos.forEach((img, index) => {
            const imgHtml = `
            <div class = "object-cover">
            <img class="border object-cover line-clamp-1 border-spacing-1 max-w-[60px] cover clickable" src="${img}" alt="image">
            </div>
            `;

            imgBlock.insertAdjacentHTML('beforeend', imgHtml);
        });

        imgBlock.querySelectorAll('.clickable').forEach((image, index) => {
            image.addEventListener('click', () => {
                mainImage.src = image.src;
                mainImage.dataset.index = index;
            });
        });

        const navigateImages = (direction) => {
            let currentIndex = parseInt(mainImage.dataset.index);
            let newIndex = currentIndex + direction;

            if (newIndex < 0) {
                newIndex = item.photos.length - 1;
            } else if (newIndex >= item.photos.length) {
                newIndex = 0;
            }

            mainImage.src = item.photos[newIndex];
            mainImage.dataset.index = newIndex;
        };

        mainImage.addEventListener('click', (event) => {
            if (event.offsetX < mainImage.width / 2) {
                navigateImages(-1);
            } else {
                navigateImages(1);
            }
        });

        document.querySelector('.left-indicator').addEventListener('click', () => {
            navigateImages(-1);
        });

        document.querySelector('.right-indicator').addEventListener('click', () => {
            navigateImages(1);
        });

    } else {
        document.getElementById('dataContainer').innerHTML = '<p>No data available</p>';
    }
});
