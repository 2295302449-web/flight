// 模拟航班数据
const flightData = [
    {
        id: 1,
        airline: "中国国航",
        flightNo: "CA1234",
        from: "北京",
        to: "上海",
        price: 399,
        originalPrice: 599,
        date: "2026-04-20",
        time: "09:30",
        isDirect: true,
        isRedEye: false,
        hasLuggage: true,
        isRefundable: true,
        targetGroup: ["学生党", "上班族"],
        ratingScore: 5,
        badges: ["含托运", "可退改", "推荐"],
        aiAnalysis: "该航班适合预算充足、行程固定的用户，也适合需要灵活退改的学生党。"
    },
    {
        id: 2,
        airline: "南方航空",
        flightNo: "CZ5678",
        from: "北京",
        to: "广州",
        price: 499,
        originalPrice: 799,
        date: "2026-04-21",
        time: "14:20",
        isDirect: true,
        isRedEye: false,
        hasLuggage: true,
        isRefundable: false,
        targetGroup: ["上班族", "家庭"],
        ratingScore: 4,
        badges: ["含托运", "慎购"],
        aiAnalysis: "该航班适合预算充足、行程固定的用户，不适合需要灵活退改的学生党。"
    },
    {
        id: 3,
        airline: "东方航空",
        flightNo: "MU9012",
        from: "上海",
        to: "成都",
        price: 299,
        originalPrice: 699,
        date: "2026-04-22",
        time: "23:15",
        isDirect: true,
        isRedEye: true,
        hasLuggage: false,
        isRefundable: false,
        targetGroup: ["学生党"],
        ratingScore: 2,
        badges: ["无行李", "红眼", "慎购"],
        aiAnalysis: "该航班适合预算有限、对时间不敏感的学生党，不适合需要舒适出行的家庭。"
    },
    {
        id: 4,
        airline: "深圳航空",
        flightNo: "ZH3456",
        from: "广州",
        to: "北京",
        price: 599,
        originalPrice: 899,
        date: "2026-04-23",
        time: "10:45",
        isDirect: true,
        isRedEye: false,
        hasLuggage: true,
        isRefundable: true,
        targetGroup: ["家庭", "上班族"],
        ratingScore: 5,
        badges: ["含托运", "可退改", "推荐"],
        aiAnalysis: "该航班适合家庭出行和上班族，提供舒适的飞行体验和灵活的退改政策。"
    },
    {
        id: 5,
        airline: "海南航空",
        flightNo: "HU7890",
        from: "成都",
        to: "上海",
        price: 349,
        originalPrice: 649,
        date: "2026-04-24",
        time: "16:30",
        isDirect: true,
        isRedEye: false,
        hasLuggage: true,
        isRefundable: false,
        targetGroup: ["学生党", "上班族"],
        ratingScore: 4,
        badges: ["含托运", "慎购"],
        aiAnalysis: "该航班适合预算有限的学生党和上班族，提供含行李的服务，但退改政策较为严格。"
    },
    {
        id: 6,
        airline: "春秋航空",
        flightNo: "9C1234",
        from: "上海",
        to: "北京",
        price: 199,
        originalPrice: 599,
        date: "2026-04-25",
        time: "06:00",
        isDirect: true,
        isRedEye: true,
        hasLuggage: false,
        isRefundable: false,
        targetGroup: ["学生党"],
        ratingScore: 1,
        badges: ["无行李", "红眼", "慎购"],
        aiAnalysis: "该航班仅适合预算非常有限、对舒适度要求不高的学生党，不适合家庭和上班族。"
    },
    {
        id: 7,
        airline: "中国国航",
        flightNo: "CA5678",
        from: "北京",
        to: "深圳",
        price: 549,
        originalPrice: 849,
        date: "2026-04-26",
        time: "11:20",
        isDirect: true,
        isRedEye: false,
        hasLuggage: true,
        isRefundable: true,
        targetGroup: ["家庭", "上班族"],
        ratingScore: 5,
        badges: ["含托运", "可退改", "推荐"],
        aiAnalysis: "该航班适合家庭出行和上班族，提供舒适的飞行体验和灵活的退改政策。"
    },
    {
        id: 8,
        airline: "南方航空",
        flightNo: "CZ9012",
        from: "广州",
        to: "上海",
        price: 399,
        originalPrice: 699,
        date: "2026-04-27",
        time: "19:45",
        isDirect: true,
        isRedEye: false,
        hasLuggage: true,
        isRefundable: false,
        targetGroup: ["上班族"],
        ratingScore: 4,
        badges: ["含托运", "慎购"],
        aiAnalysis: "该航班适合上班族，提供含行李的服务，但退改政策较为严格。"
    },
    {
        id: 9,
        airline: "东方航空",
        flightNo: "MU3456",
        from: "成都",
        to: "北京",
        price: 449,
        originalPrice: 749,
        date: "2026-04-28",
        time: "13:10",
        isDirect: true,
        isRedEye: false,
        hasLuggage: true,
        isRefundable: true,
        targetGroup: ["家庭", "上班族"],
        ratingScore: 5,
        badges: ["含托运", "可退改", "推荐"],
        aiAnalysis: "该航班适合家庭出行和上班族，提供舒适的飞行体验和灵活的退改政策。"
    },
    {
        id: 10,
        airline: "深圳航空",
        flightNo: "ZH7890",
        from: "深圳",
        to: "上海",
        price: 499,
        originalPrice: 799,
        date: "2026-04-29",
        time: "08:30",
        isDirect: true,
        isRedEye: false,
        hasLuggage: true,
        isRefundable: true,
        targetGroup: ["上班族", "家庭"],
        ratingScore: 5,
        badges: ["含托运", "可退改", "推荐"],
        aiAnalysis: "该航班适合上班族和家庭，提供舒适的早间飞行体验和灵活的退改政策。"
    },
    {
        id: 11,
        airline: "海南航空",
        flightNo: "HU1234",
        from: "北京",
        to: "成都",
        price: 399,
        originalPrice: 699,
        date: "2026-04-30",
        time: "22:00",
        isDirect: true,
        isRedEye: true,
        hasLuggage: true,
        isRefundable: false,
        targetGroup: ["学生党"],
        ratingScore: 3,
        badges: ["含托运", "红眼", "慎购"],
        aiAnalysis: "该航班适合预算有限的学生党，提供含行李的服务，但夜间飞行可能影响休息。"
    },
    {
        id: 12,
        airline: "春秋航空",
        flightNo: "9C5678",
        from: "上海",
        to: "广州",
        price: 249,
        originalPrice: 549,
        date: "2026-05-01",
        time: "07:15",
        isDirect: true,
        isRedEye: false,
        hasLuggage: false,
        isRefundable: false,
        targetGroup: ["学生党"],
        ratingScore: 2,
        badges: ["无行李", "慎购"],
        aiAnalysis: "该航班适合预算有限的学生党，价格便宜但无行李额度，退改政策严格。"
    },
    {
        id: 13,
        airline: "中国国航",
        flightNo: "CA9012",
        from: "广州",
        to: "成都",
        price: 499,
        originalPrice: 799,
        date: "2026-05-02",
        time: "15:20",
        isDirect: true,
        isRedEye: false,
        hasLuggage: true,
        isRefundable: true,
        targetGroup: ["家庭", "上班族"],
        ratingScore: 5,
        badges: ["含托运", "可退改", "推荐"],
        aiAnalysis: "该航班适合家庭出行和上班族，提供舒适的飞行体验和灵活的退改政策。"
    },
    {
        id: 14,
        airline: "南方航空",
        flightNo: "CZ3456",
        from: "北京",
        to: "杭州",
        price: 299,
        originalPrice: 599,
        date: "2026-05-03",
        time: "10:00",
        isDirect: true,
        isRedEye: false,
        hasLuggage: true,
        isRefundable: false,
        targetGroup: ["学生党", "上班族"],
        ratingScore: 4,
        badges: ["含托运", "慎购"],
        aiAnalysis: "该航班适合学生党和上班族，提供含行李的服务，但退改政策较为严格。"
    },
    {
        id: 15,
        airline: "东方航空",
        flightNo: "MU7890",
        from: "杭州",
        to: "北京",
        price: 349,
        originalPrice: 649,
        date: "2026-05-04",
        time: "17:30",
        isDirect: true,
        isRedEye: false,
        hasLuggage: true,
        isRefundable: true,
        targetGroup: ["学生党", "上班族"],
        ratingScore: 5,
        badges: ["含托运", "可退改", "推荐"],
        aiAnalysis: "该航班适合学生党和上班族，提供含行李的服务和灵活的退改政策。"
    }
];

// DOM元素
const searchBtn = document.getElementById('search-btn');
const flightsList = document.getElementById('flights-list');
const flightModal = document.getElementById('flight-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');
const priceMin = document.getElementById('price-min');
const priceMax = document.getElementById('price-max');
const priceDisplay = document.querySelector('.price-display');

let allFlights = flightData.slice();
let activeDaysFilter = null;

// 初始化
function init() {
    // 绑定事件
    bindEvents();
    // 处理URL参数
    handleUrlParams();
    // 根据输入拉取数据并渲染
    fetchAndRenderFromInputs();
}

async function fetchSearch(params) {
    const qs = new URLSearchParams();
    if (params?.from) qs.set('from', params.from);
    if (params?.to) qs.set('to', params.to);
    if (params?.date) qs.set('date', params.date);
    if (params?.days) qs.set('days', String(params.days));
    const res = await fetch(`/api/search?${qs.toString()}`, { method: 'GET' });
    if (!res.ok) throw new Error('search_failed');
    return await res.json();
}

function syncPriceRange(flights) {
    if (!Array.isArray(flights) || flights.length === 0) return;
    const prices = flights.map(f => Number(f.price)).filter(n => Number.isFinite(n));
    if (prices.length === 0) return;
    const minP = Math.max(0, Math.min(...prices));
    const maxP = Math.max(...prices);
    const maxRounded = Math.min(20000, Math.ceil(maxP / 100) * 100);
    priceMin.min = '0';
    priceMin.max = String(maxRounded);
    priceMax.min = '0';
    priceMax.max = String(maxRounded);
    priceMin.value = String(Math.min(Number(priceMin.value || 0), maxRounded));
    priceMax.value = String(Math.max(Number(priceMax.value || maxRounded), Number(priceMin.value || 0)));
    updatePriceDisplay();
}

function applyAllFilters() {
    let base = allFlights.slice();
    if (activeDaysFilter) {
        base = filterByDate(base, activeDaysFilter);
    }
    return applyFilters(base);
}

async function fetchAndRenderFromInputs(extra) {
    const from = document.getElementById('departure')?.value?.trim() || '';
    const to = document.getElementById('destination')?.value?.trim() || '';
    const date = document.getElementById('departure-date')?.value?.trim() || '';
    const days = extra?.days ?? (activeDaysFilter && !date ? activeDaysFilter : null);

    try {
        const data = await fetchSearch({ from, to, date, days });
        if (Array.isArray(data.flights) && data.flights.length) {
            allFlights = data.flights;
        } else {
            allFlights = flightData.slice();
        }
    } catch (e) {
        allFlights = flightData.slice();
    }

    syncPriceRange(allFlights);
    renderFlights(applyAllFilters());
}

// 绑定事件
function bindEvents() {
    // 搜索按钮
    searchBtn.addEventListener('click', () => {
        activeDaysFilter = null;
        document.querySelectorAll('.date-option').forEach(opt => opt.classList.remove('active'));
        fetchAndRenderFromInputs();
    });

    // 关闭模态框
    closeModal.addEventListener('click', () => {
        flightModal.classList.remove('show');
    });

    // 点击模态框外部关闭
    flightModal.addEventListener('click', (e) => {
        if (e.target === flightModal) {
            flightModal.classList.remove('show');
        }
    });

    // 价格区间变化
    priceMin.addEventListener('input', updatePriceDisplay);
    priceMax.addEventListener('input', updatePriceDisplay);

    // 价格筛选
    priceMin.addEventListener('change', () => {
        renderFlights(applyAllFilters());
    });
    priceMax.addEventListener('change', () => {
        renderFlights(applyAllFilters());
    });

    // 标签页切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            if (tabId === 'search') {
                window.location.href = 'index.html';
            } else {
                window.location.href = `index.html#${tabId}`;
            }
        });
    });

    // 日期模糊选项
    document.querySelectorAll('.date-option').forEach(option => {
        option.addEventListener('click', () => {
            // 切换选项状态
            document.querySelectorAll('.date-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
            
            // 应用日期筛选
            const days = parseInt(option.dataset.days);
            activeDaysFilter = days;
            renderFlights(applyAllFilters());
        });
    });
}

// 更新价格显示
function updatePriceDisplay() {
    const min = priceMin.value;
    const max = priceMax.value;
    priceDisplay.textContent = `¥${min} - ¥${max}`;
}

// 应用筛选
function applyFilters(flights) {
    const minPrice = parseInt(priceMin.value);
    const maxPrice = parseInt(priceMax.value);

    return flights.filter(flight => {
        // 价格筛选
        if (flight.price < minPrice || flight.price > maxPrice) return false;

        return true;
    });
}

// 按日期筛选
function filterByDate(flights, days) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);
    
    return flights.filter(flight => {
        const flightDate = new Date(flight.date);
        return flightDate >= today && flightDate <= futureDate;
    });
}

// 渲染航班列表
function renderFlights(flights) {
    flightsList.innerHTML = '';

    if (flights.length === 0) {
        flightsList.innerHTML = `
            <div class="no-results">
                <h3>哎呀，没找到符合你要求的完美航班</h3>
                <p>换个条件试试吧</p>
            </div>
        `;
        return;
    }

    flights.forEach(flight => {
        const flightCard = document.createElement('div');
        flightCard.className = 'flight-card';
        flightCard.innerHTML = `
            <div class="flight-header">
                <div class="flight-info">
                    <h3>${flight.airline} ${flight.flightNo}</h3>
                    <div class="flight-details">
                        ${flight.from} → ${flight.to}<br>
                        ${flight.date} ${flight.time}
                    </div>
                </div>
                <div class="avoidance-rating">
                    <div class="stars">${getStars(flight.ratingScore)}</div>
                    <div class="rating-text">${flight.badges.slice(0, 2).join('/')}</div>
                </div>
            </div>
            <div class="avoidance-tags">
                ${flight.badges.map(badge => getBadgeHtml(badge)).join('')}
            </div>
            <div class="flight-footer">
                <div class="flight-price">
                    <div class="current-price">¥${flight.price}</div>
                    <div class="original-price">¥${flight.originalPrice}</div>
                </div>
                <div class="flight-actions">
                    <button class="btn-secondary btn-small" onclick="showFlightDetail(${flight.id})">避坑详情</button>
                    <button class="btn-primary btn-small">立即预订</button>
                </div>
            </div>
        `;
        flightsList.appendChild(flightCard);
    });
}

// 获取星级HTML
function getStars(score) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= score) {
            stars += '★';
        } else {
            stars += '☆';
        }
    }
    return stars;
}

// 获取标签HTML
function getBadgeHtml(badge) {
    let className = 'tag-warning';
    if (badge.includes('含托运') || badge.includes('可退改') || badge.includes('推荐')) {
        className = 'tag-safe';
    } else if (badge.includes('无行李') || badge.includes('慎购') || badge.includes('红眼')) {
        className = 'tag-danger';
    }
    return `<span class="avoidance-tag ${className}">${badge}</span>`;
}

// 显示航班详情
function showFlightDetail(flightId) {
    const flight = allFlights.find(f => f.id === flightId);
    if (!flight) return;

    modalBody.innerHTML = `
        <div class="flight-detail-header">
            <h2>${flight.airline} ${flight.flightNo}</h2>
            <p>${flight.from} → ${flight.to}</p>
            <p>${flight.date} ${flight.time}</p>
            <div class="avoidance-rating" style="justify-content: center; margin-top: 16px;">
                <div class="stars">${getStars(flight.ratingScore)}</div>
                <div class="rating-text">${flight.badges.join('/')}</div>
            </div>
        </div>
        <div class="rating-details">
            <div class="rating-item">
                <h4>退改规则</h4>
                <p>${flight.isRefundable ? '<span class="tag-safe">可免费退改</span>' : '<span class="tag-danger">退改费超50%</span>'}</p>
            </div>
            <div class="rating-item">
                <h4>行李额度</h4>
                <p>${flight.hasLuggage ? '<span class="tag-safe">含20kg托运</span>' : '<span class="tag-warning">无免费行李</span>'}</p>
            </div>
            <div class="rating-item">
                <h4>时段友好度</h4>
                <p>${flight.isRedEye ? '<span class="tag-danger">红眼航班</span>' : '<span class="tag-safe">日间黄金时段</span>'}</p>
            </div>
            <div class="rating-item">
                <h4>中转合理性</h4>
                <p><span class="tag-safe">直飞航班</span></p>
            </div>
            <div class="rating-item">
                <h4>捆绑销售</h4>
                <p><span class="tag-safe">无捆绑</span></p>
            </div>
        </div>
        <div class="ai-analysis">
            <h3>AI避坑建议</h3>
            <p>${flight.aiAnalysis}</p>
        </div>
        <div style="display: flex; justify-content: center; gap: 16px; margin-top: 20px;">
            <button class="btn-secondary" onclick="flightModal.classList.remove('show')">关闭</button>
            <button class="btn-primary">立即预订</button>
        </div>
    `;

    flightModal.classList.add('show');
}

// 处理URL参数
function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const filters = {};
    
    // 从URL参数中获取筛选条件
    if (urlParams.has('from')) filters.from = urlParams.get('from');
    if (urlParams.has('to')) filters.to = urlParams.get('to');
    if (urlParams.has('date')) filters.date = urlParams.get('date');
    if (urlParams.has('template')) filters.template = urlParams.get('template');
    if (urlParams.has('days')) filters.days = urlParams.get('days');
    
    // 填充搜索框
    if (filters.from) document.getElementById('departure').value = filters.from;
    if (filters.to) document.getElementById('destination').value = filters.to;
    if (filters.date) document.getElementById('departure-date').value = filters.date;
    
    // 应用筛选
    if (filters.template) {
        // 这里可以根据模板应用相应的筛选
    }

    if (filters.days) {
        const days = parseInt(filters.days, 10);
        if (Number.isFinite(days)) {
            activeDaysFilter = days;
            document.querySelectorAll('.date-option').forEach(opt => {
                opt.classList.toggle('active', parseInt(opt.dataset.days, 10) === days);
            });
        }
    }
}

// 初始化应用
init();
