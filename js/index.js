document.getElementById('dropdownButton').addEventListener('click', function () {
    var dropdownMenu = document.getElementById('dropdownMenu');
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
        }, 300);
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
        })
        .catch(error => {
            console.error('Xatolik:', error);
        });
};

const lineBlock = (arr) => {
    arr.forEach(item => {
        const html = `
        <div class="parent-card">
            <div class="flex card_box flex-col gap-3 border cursor-pointer p-3 border-sky-500 border-spacing-[1px] rounded-lg">
                <div class="flex items-center gap-3">
                    <img class="bg-white p-1 shadow rounded-lg border-sky-500 border border-spacing-[1px]" src="${item.icon}" alt="${item.name}" class="w-8 h-8 object-contain category-icon">
                    <div class="gap-1 text-left">
                        <h2 class="text-base text-dark font-semibold leading-normal line-clamp-1">${item.name}</h2>
                        <p class="text-gray-1 text-sm leading-130 font-normal">${item.ads_count} e'lonlar</p>
                    </div>
                </div>
            </div>
            <div class="child-container hidden"></div>
        </div>
        `;
        elList.insertAdjacentHTML('beforeend', html);
    });

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
                    <div class="child-card gap-3 cursor-pointer border p-3 border-sky-500 border-spacing-[1px] rounded-lg mt-3">
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
                            data.childs.forEach(arr => {
                                const html = `
                                <div class='cursor-pointer border p-[2px] border-b-4 rounded-t-lg border-spacing-[2px]  mt-3'>
                                  <p class='text-dark font-semibold leading-normal'>${arr.name}</p>
                                </div>
                                `;
                                childsList.insertAdjacentHTML('beforeend', html);
                            });
                            childsList.classList.remove('hidden');
                        }
                    });
                });

                childContainer.classList.remove('hidden');
            }
        });

        childContainer.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    });


};

itemBaza();
