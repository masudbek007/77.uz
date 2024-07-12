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
    itemBaza()
    const lineBlock = (arr) => {
        arr.forEach(item => {
            const html = `
            <div class="group parent-card">
                <div class="flex justify-between w-full card_box gap-3 border cursor-pointer p-3 border-slate-100 border-spacing-[1px] rounded-lg shadow-sm hover:shadow-lg hover:border-sky-500 transition-all duration-300 delay-200">
                    <div class="flex items-center gap-3">
                        <img class="bg-white p-1 shadow translate-x-[-32px] rounded-lg border border-spacing-[1px] w-12 h-12 object-contain category-icon transition-all duration-300 delay-200 group-hover:border-sky-500" src="${item.icon}" alt="${item.name}">
                        <div class="text-left">
                            <h2 class="text-base text-dark font-semibold leading-normal line-clamp-1 transition-colors duration-300 delay-200 group-hover:text-sky-500 ">${item.name}</h2>
                            <p class="text-gray-1 text-sm leading-130 font-normal transition-colors duration-300 delay-200 group-hover:text-sky-500">${item.ads_count} e'lonlar</p>
                        </div>
                    </div>
                    <div>
                        <img class="indecator_img text-right w-7 pt-2 transition-transform duration-300" src="./img/indicator.svg" alt="">
                    </div>
                </div>
                <div class="child-container hidden"></div>
            </div>
            `;
            elList.insertAdjacentHTML('beforeend', html);
        });
    
        document.querySelectorAll('.card_box').forEach(card => {
            card.addEventListener('click', () => {
                const childContainer = card.nextElementSibling;
                const indicatorImg = card.querySelector('.indecator_img');
                
                if (childContainer.classList.contains('hidden')) {
                    childContainer.classList.remove('hidden');
                } else {
                    childContainer.classList.add('hidden');
                }
    
                if (indicatorImg.classList.contains('rotate-180')) {
                    indicatorImg.classList.remove('rotate-180');
                } else {
                    indicatorImg.classList.add('rotate-180');
                }
            });
        });
    };
    
    const style = document.createElement('style');
    style.innerHTML = `
        .rotate-180 {
            transform: rotate(180deg);
        }
    `;
    document.head.appendChild(style);
    

})

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
                        <div class="child-card gap-3 cursor-pointer border p-3 border-spacing-[1px] rounded-lg mt-3 hover:border-sky-500">
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
                                    <a href="./product.html" class="child-link" data-child-id="${child.id}">
                                        <div class='line_block cursor-pointer hover:border border-t-[2px] border border-b-[2px] rounded-lg mt-3' id='child-${child.id}' style='border-top: 1px solid transparent; transition: border-top-color 0.1s ease;'>
                                            <p class='child-name text-dark font-semibold leading-normal'>${child.name}</p>
                                        </div>
                                    </a>
                                `;
                                childsList.insertAdjacentHTML('beforeend', html);

                                const childLink = childsList.querySelector(`a[data-child-id='${child.id}']`);
                                childLink.addEventListener('click', (event) => {
                                    event.preventDefault();
                                    event.stopPropagation();

                                    fetch(`https://admin.77.uz/api/v1/store/list/ads/?page_size=12&page=1&category_ids=${child.id}`)
                                        .then(response => {
                                            if (!response.ok) {
                                                throw new Error('Network response was not ok');
                                            }
                                            return response.json();
                                        })
                                        .then(data => {
                                            console.log('Fetched data:', data);
                                            localStorage.setItem('childData', JSON.stringify(data.results));
                                            console.log('Data saved to localStorage');
                                            setTimeout(() => {
                                                window.location.href = './product.html';
                                            }, 500);
                                        })
                                        .catch(error => {
                                            console.error('Fetch error:', error);
                                        });

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

const cards = document.querySelector(".cards");

const cardsBlock = (arr) => {
    arr.results.forEach((item, index) => {
        const isClicked = localStorage.getItem(`heart_${index}`) === 'true';
        const heartSrc = isClicked ? './img/heard.svg' : './img/heit.svg';
        const html = `
        <div class="relative">
                    <img class="heart_img z-10 absolute w-10 top-[3%] left-[3%]" src="${heartSrc}" alt="Heart Icon" data-id="heart_${index}" data-item='${JSON.stringify(item)}'>
            <a href="./data.html" class="block_data" data-slug="${item.slug}">
                <div class="group block cursor-pointer mt-10 bg-white shadow-sm hover:shadow-xl rounded-lg pb-3 transition-all duration-300 delay-200 animate-card slide-in-left">
                    <img class="aspect-square translate-y-[-38px] rounded-t-lg object-cover" src="${item.photo}" alt="${item.name}">
                    <div class="text-left px-3">
                        <p class="py-1 px-2 bg-gray-200 rounded-md text-sm text-gray/50 leading-130 line-clamp-2 transition-colors duration-300 delay-200">${item.address.name}</p>
                        <p class="font-semibold text-lg text-left transition-colors mt-3 duration-300 delay-200 group-hover:text-sky-500 line-clamp-1">${item.name}</p>
                        <p class="text-xs md:text-base font-semibold leading-130 mt-5 text-gray-400">${item.extra.expires_at}</p>
                        <p class="text-lg md:text-xl font-semibold leading-130 mt-2 text-gray-400">${item.seller.phone_number}</p>
                        <p class="text-xl md:text-2xl font-bold leading-130 mt-3 text-black">${item.price}<span class="text-sky-500 text-lg"> UZS</span></p>
                    </div>
                </div>
            </a>

        </div>
        `;
        cards.insertAdjacentHTML('beforeend', html);
    });

    document.querySelectorAll('.heart_img').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
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

    document.querySelectorAll('.block_data').forEach(block => {
        block.addEventListener('click', (e) => {
            e.preventDefault();
            const slug = e.currentTarget.dataset.slug;
            const apiUrl = `https://admin.77.uz/api/v1/store/ads/${slug}/`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    localStorage.setItem('selectedItem', JSON.stringify(data)); 
                    window.location.href = './data.html';
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        });
    });
};



itemCards();

