const cards = document.querySelector(".cards");

        const loadSavedItems = () => {
            for (let key in localStorage) {
                if (key.startsWith('item_')) {
                    const item = JSON.parse(localStorage.getItem(key));
                    const html = `
                    <div class="group block cursor-pointer shadow-sm hover:shadow-xl rounded-lg pb-3 transition-all duration-300 delay-200">
                        <div class="top-0">
                            <img class="aspect-square rounded-t-lg object-cover" src="${item.photo}" alt="${item.name}">
                        </div>
                        <div class="text-left px-3">
                            <p class="py-1 px-2 bg-gray-200 rounded-md text-sm text-gray/50 mt-4 leading-130 line-clamp-2 transition-colors duration-300 delay-200 ">${item.address.name}</p>
                            <p class="font-semibold text-lg text-left transition-colors duration-300 delay-200 group-hover:text-sky-500">${item.name}</p>
                        </div>
                    </div>
                    `;
                    cards.insertAdjacentHTML('beforeend', html);
                }
            }
        };

        loadSavedItems();