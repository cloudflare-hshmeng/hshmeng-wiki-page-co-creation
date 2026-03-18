// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');

    // 获取随机土豆知识
    const factBtn = document.getElementById('fact-btn');
    const factDisplay = document.getElementById('fact-display');

    if (factBtn) {
        factBtn.addEventListener('click', function() {
            console.log('点击获取土豆知识按钮');
            fetch('/api/random_fact')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应不正常');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('获取到土豆知识:', data);
                    factDisplay.innerHTML = `<p><i class="fas fa-seedling"></i> ${data.fact}</p>`;
                    // 添加动画效果
                    factDisplay.style.animation = 'none';
                    setTimeout(() => {
                        factDisplay.style.animation = 'fadeIn 0.5s ease';
                    }, 10);
                })
                .catch(error => {
                    console.error('获取土豆知识失败:', error);
                    factDisplay.innerHTML = '<p>抱歉，获取土豆知识失败，请稍后重试。</p>';
                });
        });
    } else {
        console.error('找不到fact-btn按钮');
    }

    // 加载食谱数据
    loadRecipes();

    // 导航菜单点击效果
    setupNavigation();

    // 添加CSS动画
    addCSSAnimation();
});

// 加载食谱数据
function loadRecipes() {
    console.log('开始加载食谱数据...');

    // 先显示加载状态
    const recipeList = document.getElementById('recipe-list');
    if (recipeList) {
        recipeList.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> 正在加载食谱...</p>';
    }

    fetch('/api/recipes')
        .then(response => {
            console.log('API响应状态:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP错误! 状态: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('获取到的食谱数据:', data);

            const recipeList = document.getElementById('recipe-list');
            const recipeDetail = document.getElementById('recipe-detail');

            if (!recipeList || !recipeDetail) {
                console.error('找不到食谱容器元素');
                return;
            }

            // 清空现有内容
            recipeList.innerHTML = '';

            // 检查是否有数据
            if (!data.recipes || data.recipes.length === 0) {
                recipeList.innerHTML = '<p>暂无食谱数据</p>';
                return;
            }

            // 创建食谱列表
            data.recipes.forEach((recipe, index) => {
                const recipeItem = document.createElement('div');
                recipeItem.className = 'recipe-item';
                if (index === 0) {
                    recipeItem.classList.add('active');
                    // 显示第一个食谱的详情
                    showRecipeDetail(recipe, recipeDetail);
                }

                recipeItem.innerHTML = `
    <h4>${recipe.name}</h4>
    <div class="recipe-meta">
        <span><i class="far fa-clock"></i> ${recipe.time}</span>
        <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
        ${recipe.name.includes('香草') ? '<span class="herb-tag"><i class="fas fa-leaf"></i> 香草</span>' : ''}
    </div>
`;

                // 点击食谱项显示详情
                recipeItem.addEventListener('click', function() {
                    // 移除所有active类
                    document.querySelectorAll('.recipe-item').forEach(item => {
                        item.classList.remove('active');
                    });

                    // 为当前项添加active类
                    this.classList.add('active');

                    // 显示食谱详情
                    showRecipeDetail(recipe, recipeDetail);
                });

                recipeList.appendChild(recipeItem);
            });

            console.log('食谱加载完成');
        })
        .catch(error => {
            console.error('获取食谱失败:', error);
            const recipeList = document.getElementById('recipe-list');
            if (recipeList) {
                recipeList.innerHTML = `
                    <p>抱歉，加载食谱失败</p>
                    <p>错误信息: ${error.message}</p>
                    <button onclick="loadRecipes()" class="btn-primary">重试</button>
                `;
            }
        });
}

// 显示食谱详情
function showRecipeDetail(recipe, container) {
    console.log('显示食谱详情:', recipe);

    if (!container) {
        console.error('找不到食谱详情容器');
        return;
    }

    // 根据食谱名称生成不同的描述
    const descriptions = {
        "经典烤土豆": "将土豆洗净，用叉子在表面戳几个小孔，刷上橄榄油，撒上盐和黑胡椒，放入预热200°C的烤箱烤45-60分钟，直到外皮金黄酥脆。",
        "土豆泥": "土豆去皮切块，煮至软烂，沥干水分后加入黄油、牛奶、盐和胡椒，用土豆捣碎器或搅拌机打成细腻的泥状。",
        "土豆煎饼": "土豆擦成细丝，加入鸡蛋、面粉、盐和葱花搅拌均匀，用平底锅煎至两面金黄酥脆。",
        "土豆沙拉": "土豆煮熟切块，加入煮熟的鸡蛋、黄瓜、洋葱和蛋黄酱，轻轻拌匀，冷藏后食用更佳。",
        "咖喱土豆": "土豆切块，与胡萝卜、洋葱一起炒香，加入咖喱粉和椰奶，炖煮至土豆软烂，汤汁浓稠。",
        "土豆炖肉": "土豆、胡萝卜切块，与猪肉或牛肉一起炖煮，加入酱油、料酒和香料，慢炖1小时以上直至肉质酥烂。",
        "香草烤土豆": "土豆切块，与新鲜迷迭香、百里香、蒜末、橄榄油混合均匀，撒上海盐和黑胡椒，200°C烤35-40分钟至金黄酥脆。",
        "香草土豆泥": "在传统土豆泥基础上，加入切碎的新鲜香草如欧芹、细香葱和莳萝，增添清新香气和独特风味。",
        "香草土豆沙拉": "土豆煮熟切块，混合新鲜罗勒、薄荷、欧芹等香草，淋上柠檬汁和橄榄油，清爽开胃。"
    };

    const description = descriptions[recipe.name] || "一道美味的土豆菜肴，简单易做，营养丰富。";

// 根据食谱名称显示不同的香草建议
    const herbSuggestions = {
        "香草烤土豆": ["迷迭香", "百里香", "牛至", "蒜末"],
        "香草土豆泥": ["欧芹", "细香葱", "莳萝", "龙蒿"],
        "香草土豆沙拉": ["罗勒", "薄荷", "欧芹", "香菜"]
    };

    const herbs = herbSuggestions[recipe.name] || ["可根据个人口味添加喜欢的香草"];

    container.innerHTML = `
        <h3>${recipe.name}</h3>
        <div class="recipe-meta">
            <span><i class="far fa-clock"></i> 烹饪时间: ${recipe.time}</span>
            <span><i class="fas fa-signal"></i> 难度: ${recipe.difficulty}</span>
            ${recipe.name.includes('香草') ? '<span class="herb-tag"><i class="fas fa-leaf"></i> 香草风味</span>' : ''}
        </div>
        <div class="recipe-description">
            <h4>做法简介</h4>
            <p>${description}</p>
        </div>
        <div class="recipe-tips">
            <h4>小贴士</h4>
            <ul>
                <li>选择新鲜、无芽眼的土豆</li>
                <li>根据菜肴选择适合的土豆品种</li>
                <li>土豆切开后如不立即使用，可浸泡在水中防止氧化</li>
                ${recipe.name.includes('香草') ? '<li>使用新鲜香草比干香草风味更佳</li>' : ''}
            </ul>
        </div>
        ${recipe.name.includes('香草') ? `
        <div class="herb-suggestions">
            <h4><i class="fas fa-leaf"></i> 推荐香草</h4>
            <div class="herb-tags">
                ${herbs.map(herb => `<span class="herb-tag">${herb}</span>`).join('')}
            </div>
        </div>
        ` : ''}
    `;
    container.innerHTML = `
        <h3>${recipe.name}</h3>
        <div class="recipe-meta">
            <span><i class="far fa-clock"></i> 烹饪时间: ${recipe.time}</span>
            <span><i class="fas fa-signal"></i> 难度: ${recipe.difficulty}</span>
        </div>
        <div class="recipe-description">
            <h4>做法简介</h4>
            <p>${description}</p>
        </div>
        <div class="recipe-tips">
            <h4>小贴士</h4>
            <ul>
                <li>选择新鲜、无芽眼的土豆</li>
                <li>根据菜肴选择适合的土豆品种</li>
                <li>土豆切开后如不立即使用，可浸泡在水中防止氧化</li>
            </ul>
        </div>
    `;

    // 添加动画效果
    container.style.animation = 'none';
    setTimeout(() => {
        container.style.animation = 'slideIn 0.5s ease';
    }, 10);
}

// 设置导航菜单
function setupNavigation() {
    console.log('设置导航菜单...');
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');

    // 平滑滚动到对应部分
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // 更新活动链接
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');

                // 平滑滚动到目标部分
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 滚动时高亮当前部分
    window.addEventListener('scroll', function() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// 添加CSS动画
function addCSSAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .fact-box, .recipe-detail {
            animation: fadeIn 0.5s ease;
        }

        .fact-card, .gallery-item {
            animation: fadeIn 0.6s ease;
        }

        .potato-img {
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .fa-spin {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}
// 土豆营养计算器类
class PotatoNutritionCalculator {
    constructor() {
        this.currentWeight = 100;
        this.currentMethod = 'baked';
        this.currentVariety = 'russet';
        this.nutritionData = null;
        this.chart = null;

        this.init();
    }

    async init() {
        // 加载营养数据
        await this.loadNutritionData();

        // 绑定事件
        this.bindEvents();

        // 初始计算
        this.calculate();
    }
    async loadNutritionData() {
        try {
            const response = await fetch('/api/nutrition_data');
            this.nutritionData = await response.json();
            console.log('营养数据加载成功');
        } catch (error) {
            console.error('加载营养数据失败:', error);
            // 使用默认数据
            this.nutritionData = {
                raw: {
                    calories: 77, carbs: 17, protein: 2, fat: 0.1,
                    fiber: 2.2, vitaminC: 19.7, potassium: 421,
                    vitaminB6: 0.3, iron: 0.8
                },
                adjustments: {
                    baked: {calories: 1.0, vitaminC: 0.7},
                    boiled: {calories: 0.9, vitaminC: 0.5},
                    fried: {calories: 1.5, vitaminC: 0.3},
                    mashed: {calories: 1.1, vitaminC: 0.6},
                    steamed: {calories: 0.95, vitaminC: 0.8},
                    roasted: {calories: 1.2, vitaminC: 0.6}
                },
                varieties: {
                    russet: {carbs: 1.1},
                    yukon_gold: {vitaminC: 1.2},
                    red_potato: {fiber: 1.1},
                    purple: {antioxidants: 3.0},
                    sweet: {vitaminA: 769}
                }
            };
        }
    }

    bindEvents() {
        // 重量滑块和输入框同步
        const weightSlider = document.getElementById('weight-slider');
        const weightInput = document.getElementById('potato-weight');

        weightSlider.addEventListener('input', (e) => {
            weightInput.value = e.target.value;
            this.currentWeight = parseInt(e.target.value);
        });

        weightInput.addEventListener('input', (e) => {
            let value = parseInt(e.target.value);
            if (value < 50) value = 50;
            if (value > 500) value = 500;
            weightSlider.value = value;
            weightInput.value = value;
            this.currentWeight = value;
        });

        // 烹饪方式按钮
        document.querySelectorAll('.method-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentMethod = btn.dataset.method;
            });
        });

        // 品种按钮
        document.querySelectorAll('.variety-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.variety-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentVariety = btn.dataset.variety;
            });
        });

        // 计算按钮
        const calculateBtn = document.getElementById('calculate-btn');
        calculateBtn.addEventListener('click', () => this.calculate());

        // 初始计算
        this.calculate();
    }

    async calculate() {
        try {
            // 显示加载状态
            this.showLoading();

            // 发送计算请求
            const response = await fetch('/api/calculate_nutrition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    weight: this.currentWeight,
                    cooking_method: this.currentMethod,
                    variety: this.currentVariety
                })
            });

            const data = await response.json();

            // 显示结果
            this.displayResults(data);

        } catch (error) {
            console.error('计算营养失败:', error);
            this.showError('计算失败，请稍后重试');
        }
    }

    showLoading() {
        const nutritionGrid = document.getElementById('nutrition-grid');
        nutritionGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-spinner fa-spin fa-3x"></i>
                <p>正在计算...</p>
            </div>
        `;
    }

    showError(message) {
        const nutritionGrid = document.getElementById('nutrition-grid');
        nutritionGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle fa-3x"></i>
                <p>${message}</p>
                <button onclick="potatoCalculator.calculate()" class="btn-primary">重试</button>
            </div>
        `;
    }

    displayResults(data) {
        // 更新摘要
        this.updateSummary(data);

        // 更新营养网格
        this.updateNutritionGrid(data.nutrition);

        // 更新图表
        this.updateChart(data.nutrition);

        // 更新健康建议
        this.updateHealthTips(data);
    }

    updateSummary(data) {
        const summary = document.getElementById('results-summary');
        const methodNames = {
            'baked': '烤', 'boiled': '煮', 'fried': '炸',
            'mashed': '泥', 'steamed': '蒸', 'roasted': '煎'
        };
        const varietyNames = {
            'russet': '褐皮土豆', 'yukon_gold': '黄金土豆',
            'red_potato': '红皮土豆', 'purple': '紫土豆',
            'sweet': '红薯'
        };

        summary.innerHTML = `
            <p><strong>计算参数：</strong></p>
            <div class="summary-details">
                <span><i class="fas fa-weight"></i> ${data.weight}克</span>
                <span><i class="fas fa-utensils"></i> ${methodNames[data.cooking_method]}</span>
                <span><i class="fas fa-seedling"></i> ${varietyNames[data.variety]}</span>
            </div>
            <p class="calories-total">
                <i class="fas fa-fire"></i> 总热量：<strong>${data.nutrition.calories || 0} 千卡</strong>
            </p>
        `;
    }

    updateNutritionGrid(nutrition) {
        const nutritionGrid = document.getElementById('nutrition-grid');

        // 定义营养项显示配置
        const nutritionItems = [
            {key: 'calories', label: '热量', unit: '千卡', icon: 'fire'},
            {key: 'carbs', label: '碳水化合物', unit: '克', icon: 'bread-slice'},
            {key: 'protein', label: '蛋白质', unit: '克', icon: 'drumstick-bite'},
            {key: 'fat', label: '脂肪', unit: '克', icon: 'oil-can'},
            {key: 'fiber', label: '膳食纤维', unit: '克', icon: 'leaf'},
            {key: 'vitaminC', label: '维生素C', unit: '毫克', icon: 'lemon'},
            {key: 'potassium', label: '钾', unit: '毫克', icon: 'battery-full'},
            {key: 'vitaminB6', label: '维生素B6', unit: '毫克', icon: 'capsules'},
            {key: 'iron', label: '铁', unit: '毫克', icon: 'magnet'}
        ];

        // 如果是红薯，添加维生素A
        if (this.currentVariety === 'sweet' && nutrition.vitaminA) {
            nutritionItems.push({
                key: 'vitaminA', label: '维生素A', unit: '微克', icon: 'eye'
            });
        }

        // 如果是紫土豆，添加抗氧化指数
        if (this.currentVariety === 'purple' && nutrition.antioxidants) {
            nutritionItems.push({
                key: 'antioxidants', label: '抗氧化指数', unit: '指数', icon: 'shield-alt'
            });
        }

        // 生成HTML
        nutritionGrid.innerHTML = nutritionItems.map(item => {
            const value = nutrition[item.key] || 0;
            return `
                <div class="nutrition-item">
                    <div class="nutrition-icon">
                        <i class="fas fa-${item.icon}"></i>
                    </div>
                    <div class="nutrition-value">${value}</div>
                    <div class="nutrition-unit">${item.unit}</div>
                    <div class="nutrition-label">${item.label}</div>
                </div>
            `;
        }).join('');
    }

    updateChart(nutrition) {
        const ctx = document.getElementById('nutrition-chart').getContext('2d');

        // 如果已有图表，销毁它
        if (this.chart) {
            this.chart.destroy();
        }

        // 准备图表数据
        const chartData = {
            labels: ['热量', '碳水', '蛋白质', '脂肪', '纤维'],
            datasets: [{
                label: '主要营养成分',
                data: [
                    nutrition.calories || 0,
                    nutrition.carbs || 0,
                    nutrition.protein || 0,
                    nutrition.fat || 0,
                    nutrition.fiber || 0
                ],
                backgroundColor: [
                    '#FF9800', '#8BC34A', '#2196F3', '#F44336', '#9C27B0'
                ],
                borderWidth: 1
            }]
        };

        // 创建新图表
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed.y;
                                switch(context.dataIndex) {
                                    case 0: label += ' 千卡'; break;
                                    default: label += ' 克'; break;
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '含量'
                        }
                    }
                }
            }
        });
    }

    updateHealthTips(data) {
        const healthTips = document.getElementById('health-tips');
        const tips = [];

        // 基于计算结果生成健康建议
        const calories = data.nutrition.calories || 0;
        const fiber = data.nutrition.fiber || 0;
        const vitaminC = data.nutrition.vitaminC || 0;

        // 热量建议
        if (calories < 100) {
            tips.push('低热量选择，适合控制体重');
        } else if (calories < 200) {
            tips.push('中等热量，可作为一餐的主食部分');
        } else {
            tips.push('热量较高，建议搭配蔬菜和蛋白质食物');
        }

        // 纤维建议
        if (fiber > 3) {
            tips.push('富含膳食纤维，有助于消化健康');
        } else if (fiber > 1.5) {
            tips.push('含有适量纤维，有助于饱腹感');
        } else {
            tips.push('纤维含量较低，建议搭配高纤维蔬菜');
        }

        // 维生素C建议
        if (vitaminC > 15) {
            tips.push(`富含维生素C（${vitaminC}mg），满足每日需求的${Math.round(vitaminC/60*100)}%`);
        }

        // 烹饪方式建议
        if (this.currentMethod === 'fried') {
            tips.push('油炸土豆热量较高，建议适量食用');
        } else if (this.currentMethod === 'steamed' || this.currentMethod === 'boiled') {
            tips.push('蒸煮方式能最大程度保留营养成分');
        }

        // 品种特定建议
        if (this.currentVariety === 'purple') {
            tips.push('紫土豆富含花青素，抗氧化能力强');
        } else if (this.currentVariety === 'sweet') {
            tips.push('红薯富含β-胡萝卜素，有益眼睛健康');
        } else if (this.currentVariety === 'yukon_gold') {
            tips.push('黄金土豆维生素C含量较高');
        }

        // 钾含量建议
        const potassium = data.nutrition.potassium || 0;
        if (potassium > 300) {
            tips.push(`富含钾元素（${potassium}mg），有助于维持正常血压`);
        }

        // 生成HTML
        healthTips.innerHTML = `
            <h4><i class="fas fa-heart"></i> 健康建议</h4>
            <ul>
                ${tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
            <div class="daily-value">
                <small>* 基于每日2000千卡饮食的参考值</small>
            </div>
        `;
    }
}

// 在页面加载完成后初始化计算器
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');

    // 初始化营养计算器
    window.potatoCalculator = new PotatoNutritionCalculator();

    // 原有的其他初始化代码...
    // 获取随机土豆知识
    const factBtn = document.getElementById('fact-btn');
    const factDisplay = document.getElementById('fact-display');

    if (factBtn) {
        factBtn.addEventListener('click', function() {
            console.log('点击获取土豆知识按钮');
            fetch('/api/random_fact')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应不正常');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('获取到土豆知识:', data);
                    factDisplay.innerHTML = `<p><i class="fas fa-seedling"></i> ${data.fact}</p>`;
                    // 添加动画效果
                    factDisplay.style.animation = 'none';
                    setTimeout(() => {
                        factDisplay.style.animation = 'fadeIn 0.5s ease';
                    }, 10);
                })
                .catch(error => {
                    console.error('获取土豆知识失败:', error);
                    factDisplay.innerHTML = '<p>抱歉，获取土豆知识失败，请稍后重试。</p>';
                });
        });
    } else {
        console.error('找不到fact-btn按钮');
    }

    // 加载食谱数据
    loadRecipes();

    // 导航菜单点击效果
    setupNavigation();

    // 添加CSS动画
    addCSSAnimation();
});