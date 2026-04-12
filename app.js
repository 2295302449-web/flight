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

// 模板配置
const templates = {
    student: {
        name: "学生党·省钱优先",
        filters: {
            pricePreference: "lowest",
            excludeBundles: true
        }
    },
    office: {
        name: "上班族·周末友好",
        filters: {
            noRedEye: true,
            dayFlight: true,
            timePreference: "time"
        }
    },
    family: {
        name: "家庭·舒适出行",
        filters: {
            withBaggage: true,
            refundable: true,
            directFlight: true
        }
    },
    spontaneous: {
        name: "说走就走·盲盒特价",
        filters: {
            pricePreference: "lowest"
        }
    }
};

// DOM元素
const toggleFiltersBtn = document.getElementById('toggle-filters');
const filterPanel = document.getElementById('filter-panel');
const searchBtn = document.getElementById('search-btn');
const templateBtns = document.querySelectorAll('.template-btn');
const flightsList = document.getElementById('flights-list');
const dealsCarousel = document.getElementById('deals-carousel');
const flightModal = document.getElementById('flight-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');

// 预设关注航班数据
const favoriteFlights = [
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
        ratingScore: 5,
        badges: ["含托运", "可退改"]
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
        ratingScore: 4,
        badges: ["含托运"]
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
        ratingScore: 2,
        badges: ["无行李", "红眼"]
    }
];

// 初始化
function init() {
    // 绑定事件
    bindEvents();
    // 渲染特价机票
    renderDeals();
    // 渲染默认航班列表
    renderFlights(flightData);
    // 渲染关注航班
    renderFavorites();
}

// 绑定事件
function bindEvents() {
    // 切换筛选面板
    toggleFiltersBtn.addEventListener('click', () => {
        filterPanel.classList.toggle('show');
    });

    // 搜索按钮
    searchBtn.addEventListener('click', () => {
        const from = document.getElementById('departure').value;
        const to = document.getElementById('destination').value;
        const date = document.getElementById('departure-date').value;
        
        // 跳转到结果页面
        window.location.href = `results.html?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`;
    });

    // 模板按钮
    templateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const templateId = btn.dataset.template;
            applyTemplate(templateId);
            btn.classList.add('active');
            templateBtns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.classList.remove('active');
                }
            });
            
            const from = document.getElementById('departure').value;
            const to = document.getElementById('destination').value;
            const date = document.getElementById('departure-date').value;
            
            // 跳转到结果页面
            window.location.href = `results.html?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}&template=${templateId}`;
        });
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

    // 高级筛选变化
    document.querySelectorAll('#filter-panel input').forEach(input => {
        input.addEventListener('change', () => {
            const filteredFlights = applyFilters(flightData);
            renderFlights(filteredFlights);
        });
    });

    // 标签页切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // 切换标签按钮状态
            document.querySelectorAll('.tab-btn').forEach(tabBtn => {
                tabBtn.classList.remove('active');
            });
            btn.classList.add('active');
            
            // 切换内容区域
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}-section`).classList.add('active');
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
            
            const from = document.getElementById('departure').value;
            const to = document.getElementById('destination').value;
            const date = document.getElementById('departure-date').value;
            const days = parseInt(option.dataset.days);
            
            // 跳转到结果页面
            window.location.href = `results.html?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}&days=${days}`;
        });
    });
}

// 应用模板
function applyTemplate(templateId) {
    const template = templates[templateId];
    if (!template) return;

    // 重置所有筛选
    resetFilters();

    // 应用模板筛选
    if (template.filters.pricePreference) {
        document.querySelector(`input[name="price-preference"][value="${template.filters.pricePreference}"]`).checked = true;
    }

    if (template.filters.noRedEye) {
        document.getElementById('no-red-eye').checked = true;
    }

    if (template.filters.dayFlight) {
        document.getElementById('day-flight').checked = true;
    }

    if (template.filters.withBaggage) {
        document.getElementById('with-baggage').checked = true;
    }

    if (template.filters.refundable) {
        document.getElementById('refundable').checked = true;
    }

    if (template.filters.directFlight) {
        document.getElementById('direct-flight').checked = true;
    }

    if (template.filters.excludeBundles) {
        document.getElementById('exclude-bundles').checked = true;
    }
}

// 重置筛选
function resetFilters() {
    document.querySelectorAll('#filter-panel input').forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else if (input.type === 'radio') {
            input.checked = false;
        }
    });
}

// 应用筛选
function applyFilters(flights) {
    const directFlight = document.getElementById('direct-flight').checked;
    const noRedEye = document.getElementById('no-red-eye').checked;
    const dayFlight = document.getElementById('day-flight').checked;
    const shortLayover = document.getElementById('short-layover').checked;
    const withBaggage = document.getElementById('with-baggage').checked;
    const excludeNoBaggage = document.getElementById('exclude-no-baggage').checked;
    const refundable = document.getElementById('refundable').checked;
    const excludeBundles = document.getElementById('exclude-bundles').checked;
    const pricePreference = document.querySelector('input[name="price-preference"]:checked')?.value;

    return flights.filter(flight => {
        // 行程偏好筛选
        if (directFlight && !flight.isDirect) return false;
        if (noRedEye && flight.isRedEye) return false;
        if (dayFlight && flight.isRedEye) return false;

        // 行李与退改筛选
        if (withBaggage && !flight.hasLuggage) return false;
        if (excludeNoBaggage && !flight.hasLuggage) return false;
        if (refundable && !flight.isRefundable) return false;

        // 价格偏好筛选
        if (pricePreference === 'lowest' && flight.price > 400) return false;

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

// 渲染特价机票
function renderDeals() {
    const deals = flightData.slice(0, 3);
    dealsCarousel.innerHTML = '';

    deals.forEach(flight => {
        const dealCard = document.createElement('div');
        dealCard.className = 'deal-card';
        dealCard.innerHTML = `
            <div class="deal-tag">限时特价</div>
            <h3>${flight.from} → ${flight.to}</h3>
            <p>${flight.airline} ${flight.flightNo}</p>
            <p>${flight.date} ${flight.time}</p>
            <div class="deal-price">¥${flight.price}</div>
            <p class="original-price">¥${flight.originalPrice}</p>
            <button class="btn-primary btn-small" onclick="showFlightDetail(${flight.id})">查看详情</button>
        `;
        dealsCarousel.appendChild(dealCard);
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
    const flight = flightData.find(f => f.id === flightId);
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

// 渲染关注航班
function renderFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    if (!favoritesList) return;

    favoritesList.innerHTML = '';

    if (favoriteFlights.length === 0) {
        favoritesList.innerHTML = `
            <div class="no-results">
                <h3>还没有关注的航班</h3>
                <p>去搜索页面添加关注吧</p>
            </div>
        `;
        return;
    }

    favoriteFlights.forEach(flight => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        favoriteItem.innerHTML = `
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
                    <button class="btn-secondary btn-small" onclick="showFlightDetail(${flight.id})">查看详情</button>
                    <button class="btn-primary btn-small">立即预订</button>
                </div>
            </div>
        `;
        favoritesList.appendChild(favoriteItem);
    });
}

// 初始化应用
init();