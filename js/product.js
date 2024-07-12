document.addEventListener('DOMContentLoaded', () => {
    const childData = localStorage.getItem('childData');
    const productList = document.getElementById('product-list');

    if (childData) {
        const dataArray = JSON.parse(childData);

        dataArray.forEach(data => {
            const productHTML = `
                <div class="product">
                    <div class="group block cursor-pointer bg-white shadow-sm hover:shadow-xl rounded-lg pb-3 transition-all duration-300 delay-200">
                        <div>
                          <img class="aspect-square translate-y-[-38px] rounded-t-lg object-cover" src="${data.photo}" alt="${data.name}">
                          <img class="w-9" src="./img/heart.svg" alt="${data.name}">

                        </div>
                        <div class="text-left px-3">
                            <p class="py-1 px-2 bg-gray-200 rounded-md text-sm text-gray/50 leading-130 line-clamp-2 transition-colors duration-300 delay-200 ">${data.address.name}</p>
                            <p class="font-semibold text-lg text-left transition-colors mt-3 duration-300 delay-200 group-hover:text-sky-500">${data.name}</p>
                            <p class="text-xs md:text-base font-semibold leading-130 mt-5 text-gray-400">${data.extra.expires_at}</p>
                            <p class="text-lg md:text-xl font-semibold leading-130 mt-2 text-gray-400">${data.seller.phone_number}</p>
                            <p class="text-xl md:text-2xl font-bold leading-130 mt-3 text-black">${data.price}<span class="text-sky-500 text-lg"> UZS</span></p>
                        </div>
                    </div>
                </div>
            `;
            productList.insertAdjacentHTML('beforeend', productHTML);
        });
    } else {
        const productHTML = `<h2> Malumotlar topilmadi</h2>`;
        productList.insertAdjacentHTML('beforeend', productHTML);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const elList = document.querySelector('.filter_list');

    const itemBaza = () => {
        fetch('https://admin.77.uz/api/v1/store/categories-with-childs/')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                renderItems(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    itemBaza();

    const renderItems = (items) => {
        items.forEach(item => {
            const html = `
                <div class="parent-card ml-2">
                     <div class="card_box flex items-center gap-1">
                         <input class="w-3 rounded-full mt-3" type="checkbox" id="checkbox-${item.id}">
                         <label class="border-b-[1px] text-base mt-3 ml-1 text-dark font-semibold leading-normal line-clamp-1 transition-colors duration-300 delay-200 hover:text-sky-500" for="checkbox-${item.id}">${item.name}</label>
                         <div>
                             <img class="indecator_img text-right w-6  transition-transform duration-300 rotate-180" src="./img/indicator.svg" alt="">
                         </div>   
                     </div>

                    <div class="child-container hidden"></div>
                </div>
            `;
            elList.insertAdjacentHTML('beforeend', html);
        });

        attachCardClickEvents(items);
    };

    const attachCardClickEvents = (arr) => {
        document.querySelectorAll('.parent-card').forEach((card, index) => {
            const cardBox = card.querySelector('.card_box');
            const childContainer = card.querySelector('.child-container');

            cardBox.addEventListener('click', () => {
                if (childContainer.classList.contains('hidden')) {
                    renderChildren(childContainer, arr[index].childs);
                    childContainer.classList.remove('hidden');
                } else {
                    childContainer.innerHTML = '';
                    childContainer.classList.add('hidden');
                }

                card.classList.toggle('clicked');
            });
        });
    };

    const renderChildren = (container, children) => {
        children.forEach(child => {
            const childHtml = `
                <div class="child-card ml-2">
                    <div class="card_box flex">
                        <input type="checkbox" id="checkbox-${child.id}">
                        <label class = "line-clamp-1" for="checkbox-${child.id}">${child.name}</label>
                    </div>
                    <div class="child-container hidden"></div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', childHtml);

            const childCard = container.lastElementChild;
            const childBox = childCard.querySelector('.card_box');
            const childSubContainer = childCard.querySelector('.child-container');

            childBox.addEventListener('click', (event) => {
                event.stopPropagation();
                if (childSubContainer.classList.contains('hidden')) {
                    renderChildren(childSubContainer, child.childs);
                    childSubContainer.classList.remove('hidden');
                } else {
                    childSubContainer.innerHTML = '';
                    childSubContainer.classList.add('hidden');
                }
            });
        });
    };
});
