document.getElementById('dropdownButton').addEventListener('click', function () {
    let dropdownMenu = document.getElementById('dropdownMenu');
    dropdownMenu.classList.toggle('hidden');
});

function setLanguage(language, imgSrc, shortText, fullText) {
    var dropdownButton = document.getElementById('dropdownButton');
    dropdownButton.innerHTML = `
        <span class="sm:hidden">
            <img class="w-6" src="${imgSrc}" alt="${language}">
            <font style="vertical-align: inherit;">
                <font style="vertical-align: inherit;">${shortText}</font>
            </font>
        </span>     
        <span class="hidden sm:inline">
            <img class="w-6" src="${imgSrc}" alt="${language}">
            <font style="vertical-align: inherit;">
                <font style="vertical-align: inherit;">${fullText}</font>
            </font>
        </span>
        <i class="fas fa-chevron-down text-slate-900 text-2xl -rotate-90 transition duration-300"></i>
    `;
    document.getElementById('dropdownMenu').classList.add('hidden');
}

const categoryBaza = () => {
    fetch('https://admin.77.uz/api/v1/store/sub-category/')
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            inputBaza(data);
        })
        .catch(error => {
            console.error('Xatolik:', error);
        });
};

const inputBaza = (data) => {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');
    const overlay = document.getElementById('overlay');
    const searchContainer = document.getElementById('searchContainer');
    const clearInput = document.getElementById('clearInput');

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = data.filter(item => item.name.toLowerCase().includes(searchTerm));

        displayResults(filteredData);
    });

    searchInput.addEventListener('focus', () => {
        overlay.style.display = 'block';
        resultsContainer.style.display = 'block';
        searchContainer.classList.add('dark-mode');
    });

    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            overlay.style.display = 'none';
            resultsContainer.style.display = 'none';
            searchContainer.classList.remove('dark-mode');
        }, 500);
    });

    clearInput.addEventListener('click', () => {
        searchInput.value = '';
        resultsContainer.innerHTML = '';
    });
};

const displayResults = (results) => {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found</p>';
        return;
    }

    const ul = document.createElement('ul');
    ul.className = 'results-list';
    results.forEach(item => {
        const li = document.createElement('li');
        li.className = 'results-item';

        li.textContent = item.name;
        ul.appendChild(li);
    });
    resultsContainer.appendChild(ul);
};

categoryBaza();

document.addEventListener('DOMContentLoaded', () => {
    const elList = document.querySelector('.list');

    const itemBaza = () => {
        fetch('https://admin.77.uz/api/v1/store/categories-with-childs/')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                lineBlock(data);
                attachCardClickEvents(data);
            })
            .catch(error => {
                console.error('Xatolik:', error);
            });
    };

    const lineBlock = (arr) => {
        arr.forEach(item => {
            const html = `
            <div class="group parent-card">
                <div class="flex card_box flex-col gap-3 border cursor-pointer p-3 border-slate-200 border-spacing-[1px] rounded-lg shadow-sm hover:shadow-lg hover:border-sky-500 transition-all duration-300 delay-200">
                    <div class="flex items-center gap-3">
                        <img class="bg-white p-1 shadow translate-x-[-32px] rounded-lg border border-spacing-[1px] w-12 h-12 object-contain category-icon transition-all duration-300 delay-200 hover:border-sky-500" src="${item.icon}" alt="${item.name}">
                        <div class="text-left">
                            <h2 class="text-base text-dark font-semibold leading-normal line-clamp-1 transition-colors duration-300 delay-200 group-hover:text-sky-500">${item.name}</h2>
                            <p class="text-gray-1 text-sm leading-130 font-normal transition-colors duration-300 delay-200 group-hover:text-sky-500">${item.ads_count} e'lonlar</p>
                        </div>
                    </div>
                </div>
                <div class="child-container hidden"></div>
            </div>
            `;
            elList.insertAdjacentHTML('beforeend', html);
        });
    };

    const attachCardClickEvents = (arr) => {
        document.querySelectorAll('.parent-card').forEach((card, index) => {
            const cardBox = card.querySelector('.card_box');
            const childContainer = card.querySelector('.child-container');

            cardBox.addEventListener('click', () => {
                if (childContainer.hasChildNodes()) {
                    childContainer.innerHTML = '';
                    childContainer.classList.add('hidden');
                } else {
                    arr[index].childs.forEach(data => {
                        const childHtml = `
                        <div class="child-card gap-3 cursor-pointer border p-3  border-spacing-[1px] rounded-lg mt-3 hover:border-sky-500">
                            <h2 class="child-item text-dark font-semibold leading-normal">${data.name}</h2>
                            <div class="childs_list hidden"></div>
                        </div>
                        `;
                        childContainer.insertAdjacentHTML('beforeend', childHtml);

                        const childCard = childContainer.lastElementChild;
                        const childsList = childCard.querySelector('.childs_list');

                        childCard.addEventListener('click', (event) => {
                            event.stopPropagation();

                            if (childsList.hasChildNodes()) {
                                childsList.innerHTML = '';
                                childsList.classList.add('hidden');
                            } else {
                                data.childs.forEach(child => {
                                    const html = `
                                    <a href="./product.html">
                                    <div class='line_block cursor-pointer p-[2px] rounded-t-lg mt-3' id='child-${child.id}' style='border-top: 1px solid transparent; transition: border-top-color 0.1s ease;'>
                                           <p class='text-dark font-semibold leading-normal'>${child.name}</p>
                                       </div>
                                    </a>
                                      `;
                                    childsList.insertAdjacentHTML('beforeend', html);

                                    const childDiv = document.getElementById(`child-${child.id}`);
                                    childDiv.addEventListener('click', () => {

                                    });
                                });

                                childsList.classList.remove('hidden');
                            }
                        });
                    });

                    childContainer.classList.remove('hidden');
                }
            });


        });
    };

    itemBaza();
});


const itemCards = () => {
    fetch('https://admin.77.uz/api/v1/store/list/ads/?page_size=12&page=1')
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            cardsBlock(data)
        })
        .catch(error => {
            console.error('Xatolik:', error);
        });
};

const cards = document.querySelector(".cards")

const cardsBlock = (arr) => {
    arr.results.forEach((item, index) => {
        const isClicked = localStorage.getItem(`heart_${index}`) === 'true';
        const heartSrc = isClicked ? './img/heard.svg' : './img/heit.svg';
        const html = `
        <div class="group block cursor-pointer shadow-sm hover:shadow-xl rounded-lg pb-3 transition-all duration-300 delay-200">
            <div class="top-0">
                <img class="heard_img w-10 translate-x-1 translate-y-[45px]" src="${heartSrc}" alt="Heart Icon" data-id="heart_${index}" data-item='${JSON.stringify(item)}'>
                <img class="aspect-square rounded-t-lg object-cover" src="${item.photo}" alt="${item.name}">
            </div>
            <div class="text-left px-3">
                <p class="py-1 px-2 bg-gray-200 rounded-md text-sm text-gray/50 mt-4 leading-130 line-clamp-2 transition-colors duration-300 delay-200 ">${item.address.name}</p>
                <p class="font-semibold text-lg text-left transition-colors duration-300 delay-200 group-hover:text-sky-500">${item.name}</p>
            </div>
        </div>
        `;
        cards.insertAdjacentHTML('beforeend', html);
    });

    document.querySelectorAll('.heard_img').forEach(img => {
        img.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const item = JSON.parse(e.target.dataset.item);
            const isClicked = localStorage.getItem(id) === 'true';

            if (isClicked) {
                e.target.src = './img/heit.svg';
                localStorage.setItem(id, 'false');
                localStorage.removeItem(`item_${id}`);
            } else {
                e.target.src = './img/heard.svg';
                localStorage.setItem(id, 'true');
                localStorage.setItem(`item_${id}`, JSON.stringify(item));
            }
        });
    });
};

itemCards();
