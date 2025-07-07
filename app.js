// App State
let currentUser = null;

// Language Translations
const translations = {
    en: {
        title: "Binary Trading Platform",
        trade: "Trade",
        markets: "Markets",
        portfolio: "Portfolio",
        connect_wallet: "Connect Wallet",
        connected: "Connected",
        recent_trades: "Recent Trades",
        all: "All",
        open: "Open",
        completed: "Completed",
        pair: "Pair",
        direction: "Direction",
        amount: "Amount",
        payout: "Payout",
        status: "Status",
        time: "Time",
        wallet_balance: "Wallet Balance",
        deposit: "Deposit",
        withdraw: "Withdraw",
        total_balance: "Total Balance",
        total_value: "Total Value",
        change_24h: "24h Change",
        place_trade: "Place Trade",
        trade_payout: "Trade with up to 90% payout",
        buy: "Buy",
        sell: "Sell",
        asset_pair: "Trading Pair",
        amount: "Amount",
        duration: "Duration",
        potential_payout: "Potential Payout",
        seconds_30: "30 Seconds",
        minute_1: "1 Minute",
        minutes_5: "5 Minutes",
        minutes_15: "15 Minutes",
        minutes_30: "30 Minutes",
        hour_1: "1 Hour",
        sol_usdt: "SOL/USDT",
        btc_usdt: "BTC/USDT",
        eth_usdt: "ETH/USDT",
        bnb_usdt: "BNB/USDT",
        ada_usdt: "ADA/USDT",
        xrp_usdt: "XRP/USDT",
        gold_usdt: "GOLD/USDT",
        price: "Price",
        volume: "Volume",
        asset: "Asset",
        value: "Value",
        wallet_connected_success: "Wallet connected successfully!",
        wallet_connection_failed: "Invalid username or password. Use demo/demo123",
        connect_wallet_first: "Please connect your wallet first!",
        invalid_amount: "Please enter a valid amount",
        insufficient_balance: "Insufficient balance",
        successful_trade: "Successfully placed",
        order_for: "order for",
        deposit_coming_soon: "Deposit functionality coming soon!",
        withdraw_coming_soon: "Withdraw functionality coming soon!"
    },
    vi: {
        title: "Nền Tảng Giao Dịch Nhị Phân",
        trade: "Giao Dịch",
        markets: "Thị Trường",
        portfolio: "Danh Mục",
        connect_wallet: "Kết Nối Ví",
        connected: "Đã Kết Nối",
        recent_trades: "Giao Dịch Gần Đây",
        all: "Tất Cả",
        open: "Đang Mở",
        completed: "Hoàn Thành",
        pair: "Cặp",
        direction: "Hướng",
        amount: "Số Lượng",
        payout: "Thanh Toán",
        status: "Trạng Thái",
        time: "Thời Gian",
        wallet_balance: "Số Dư Ví",
        deposit: "Nạp Tiền",
        withdraw: "Rút Tiền",
        total_balance: "Tổng Số Dư",
        total_value: "Tổng Giá Trị",
        change_24h: "Thay Đổi 24h",
        place_trade: "Đặt Giao Dịch",
        trade_payout: "Giao dịch với lợi nhuận lên đến 90%",
        buy: "Mua",
        sell: "Bán",
        asset_pair: "Cặp Giao Dịch",
        amount: "Số Lượng",
        duration: "Thời Gian",
        potential_payout: "Lợi Nhuận Tiềm Năng",
        seconds_30: "30 Giây",
        minute_1: "1 Phút",
        minutes_5: "5 Phút",
        minutes_15: "15 Phút",
        minutes_30: "30 Phút",
        hour_1: "1 Giờ",
        sol_usdt: "SOL/USDT",
        btc_usdt: "BTC/USDT",
        eth_usdt: "ETH/USDT",
        bnb_usdt: "BNB/USDT",
        ada_usdt: "ADA/USDT",
        xrp_usdt: "XRP/USDT",
        gold_usdt: "VÀNG/USDT",
        price: "Giá",
        volume: "Khối Lượng",
        asset: "Tài Sản",
        value: "Giá Trị",
        wallet_connected_success: "Kết nối ví thành công!",
        wallet_connection_failed: "Tên người dùng hoặc mật khẩu không hợp lệ. Sử dụng demo/demo123",
        connect_wallet_first: "Vui lòng kết nối ví trước!",
        invalid_amount: "Vui lòng nhập số lượng hợp lệ",
        insufficient_balance: "Số dư không đủ",
        successful_trade: "Đã đặt",
        order_for: "lệnh cho",
        deposit_coming_soon: "Chức năng nạp tiền sẽ sớm ra mắt!",
        withdraw_coming_soon: "Chức năng rút tiền sẽ sớm ra mắt!"
    }
};

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const closeModal = document.querySelector('.close-modal');
const depositBtn = document.getElementById('depositBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const buyBtn = document.getElementById('buyBtn');
const sellBtn = document.getElementById('sellBtn');
const amountInput = document.getElementById('amount');
const durationSelect = document.getElementById('duration');
const assetPairSelect = document.getElementById('assetPair');
const walletBalanceEl = document.getElementById('walletBalance');
const payoutAmountEl = document.getElementById('payoutAmount');
const priceChangeEl = document.getElementById('priceChange');
const amountSuffixEl = document.getElementById('amountSuffix');
const tradesList = document.querySelector('.trades-list');
const marketsList = document.querySelector('.markets-list');
const portfolioList = document.querySelector('.portfolio-list');
const portfolioBalanceEl = document.getElementById('portfolioBalance');
const portfolioValueEl = document.getElementById('portfolioValue');
const tabs = document.querySelectorAll('.tab');

const userInfoContainer = document.createElement('div');
userInfoContainer.className = 'user-info';
userInfoContainer.style.display = 'none';
userInfoContainer.innerHTML = `
    <div class="user-avatar">U</div>
    <span class="user-name">User</span>
`;
if (connectWalletBtn) {
    connectWalletBtn.parentNode.insertBefore(userInfoContainer, connectWalletBtn.nextSibling);
}

// App State
let balance = 0;
let currentTab = 'buy';
let currentAssetPair = 'SOL/USDT';
let chartData = null;

// Mock data for trades
const mockTrades = [
    { id: 1, pair: 'SOL/USDT', type: 'buy', amount: 0.1, price: 150, time: '12:30:45', status: 'completed' },
    { id: 2, pair: 'BTC/USDT', type: 'sell', amount: 0.005, price: 30000, time: '12:25:30', status: 'completed' },
    { id: 3, pair: 'ETH/USDT', type: 'buy', amount: 0.02, price: 2000, time: '12:20:15', status: 'pending' },
];

// Mock price data for different assets
const assetPriceData = {
    'SOL/USDT': { basePrice: 150, volatility: 10, usdValue: 150 },
    'BTC/USDT': { basePrice: 30000, volatility: 1000, usdValue: 30000 },
    'ETH/USDT': { basePrice: 2000, volatility: 100, usdValue: 2000 },
    'BNB/USDT': { basePrice: 300, volatility: 20, usdValue: 300 },
    'ADA/USDT': { basePrice: 0.5, volatility: 0.05, usdValue: 0.5 },
    'XRP/USDT': { basePrice: 0.7, volatility: 0.07, usdValue: 0.7 },
    'GOLD/USDT': { basePrice: 1800, volatility: 50, usdValue: 1800 }
};

// Mock portfolio data
const portfolioData = {
    'SOL': { amount: 10.5, usdValue: 150 },
    'BTC': { amount: 0.02, usdValue: 30000 },
    'ETH': { amount: 0.1, usdValue: 2000 },
    'BNB': { amount: 0.5, usdValue: 300 },
    'ADA': { amount: 100, usdValue: 0.5 },
    'XRP': { amount: 50, usdValue: 0.7 },
    'GOLD': { amount: 0.01, usdValue: 1800 }
};

// Mock Login Function
function login(username, password) {
    const language = localStorage.getItem('language') || 'en';
    const trans = translations[language];
    if (username === 'demo' && password === 'demo123') {
        currentUser = {
            username: 'demo',
            name: 'Demo User',
            balance: 1000,
            initial: 'DU'
        };

        userInfoContainer.style.display = 'flex';
        userInfoContainer.querySelector('.user-avatar').textContent = currentUser.initial;
        userInfoContainer.querySelector('.user-name').textContent = currentUser.name;
        if (connectWalletBtn) connectWalletBtn.style.display = 'none';

        if (loginModal) loginModal.style.display = 'none';

        updateBalance(currentUser.balance);
        updatePortfolioList();

        return true;
    }
    return false;
}

// Update wallet balance
function updateBalance(newBalance) {
    balance = newBalance;
    if (walletBalanceEl) walletBalanceEl.textContent = `${balance.toFixed(2)} SOL`;
    if (portfolioBalanceEl) updatePortfolioList();
}

// Initialize Language
function initLanguage() {
    const language = localStorage.getItem('language') || 'en';
    const trans = translations[language];

    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (trans[key]) {
            element.textContent = trans[key];
        }
    });

    document.title = trans.title;

    document.querySelectorAll('#assetPair option, #duration option').forEach(option => {
        const key = option.getAttribute('data-lang-key');
        if (trans[key]) {
            option.textContent = trans[key];
        }
    });
}

// Initialize Chart
function initChart() {
    const chartContainer = document.getElementById('tradingChart');
    if (!chartContainer) return null;

    const chart = LightweightCharts.createChart(chartContainer, {
        width: chartContainer.clientWidth,
        height: 380,
        layout: {
            backgroundColor: '#1e1e2e',
            textColor: '#d1d4dc',
        },
        grid: {
            vertLines: {
                color: 'rgba(42, 46, 57, 0.5)',
            },
            horzLines: {
                color: 'rgba(42, 46, 57, 0.5)',
            },
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        rightPriceScale: {
            borderColor: 'rgba(197, 203, 206, 0.8)',
        },
        timeScale: {
            borderColor: 'rgba(197, 203, 206, 0.8)',
            timeVisible: true,
            secondsVisible: false,
        },
    });

    const candleSeries = chart.addCandlestickSeries({
        upColor: '#0cbc87',
        downColor: '#f6465d',
        borderDownColor: '#f6465d',
        borderUpColor: '#0cbc87',
        wickDownColor: '#f6465d',
        wickUpColor: '#0cbc87',
    });

    window.addEventListener('resize', () => {
        chart.applyOptions({ width: chartContainer.clientWidth });
    });

    return { chart, candleSeries };
}

// Update chart data based on selected asset pair
function updateChartData(candleSeries) {
    if (!candleSeries) return;

    const assetData = assetPriceData[currentAssetPair];
    const now = Math.floor(Date.now() / 1000);
    let lastClose = assetData.basePrice;
    const initialData = [];

    for (let i = 0; i < 100; i++) {
        const time = now - (100 - i) * 60;
        const changePercent = (Math.random() * 0.002 - 0.001);
        const newClose = lastClose * (1 + changePercent);
        const volatility = assetData.volatility * (0.5 + Math.random() * 1.5);
        const open = lastClose;
        const close = newClose;
        const high = Math.max(open, close) * (1 + Math.random() * 0.001 * volatility);
        const low = Math.min(open, close) * (1 - Math.random() * 0.001 * volatility);
        const trueHigh = Math.max(open, high, close);
        const trueLow = Math.min(open, low, close);

        initialData.push({
            time,
            open,
            high: trueHigh,
            low: trueLow,
            close,
        });

        lastClose = close;
    }

    candleSeries.setData(initialData);
    chartData = initialData;

    if (priceChangeEl) {
        const priceChange = ((initialData[99].close - initialData[0].open) / initialData[0].open * 100).toFixed(2);
        priceChangeEl.textContent = `${priceChange > 0 ? '+' : ''}${priceChange}%`;
        priceChangeEl.style.color = priceChange >= 0 ? '#0cbc87' : '#f6465d';
    }
}

// Generate a new candle based on the last candle
function generateNewCandle(previousData) {
    const assetData = assetPriceData[currentAssetPair];
    const lastCandle = previousData[previousData.length - 1];
    const now = Math.floor(Date.now() / 1000);

    const changePercent = (Math.random() * 0.002 - 0.001);
    const newClose = lastCandle.close * (1 + changePercent);
    const open = lastCandle.close;
    const close = newClose;
    const volatility = assetData.volatility * (0.5 + Math.random() * 1.5);
    const high = Math.max(open, close) * (1 + Math.random() * 0.001 * volatility);
    const low = Math.min(open, close) * (1 - Math.random() * 0.001 * volatility);

    return {
        time: now,
        open,
        high: Math.max(open, high, close),
        low: Math.min(open, low, close),
        close
    };
}

// Update trade history list
function updateTradeHistory() {
    if (!tradesList) return;

    const language = localStorage.getItem('language') || 'en';
    const trans = translations[language];
    tradesList.innerHTML = '';
    mockTrades.forEach(trade => {
        const tradeEl = document.createElement('tr');
        tradeEl.innerHTML = `
            <td class="pair">${trade.pair}</td>
            <td class="direction ${trade.type}">${trans[trade.type]}</td>
            <td>${trade.amount} ${trade.pair.split('/')[0]}</td>
            <td class="${trade.status === 'completed' ? 'profit' : 'loss'}">${trade.price}</td>
            <td class="status ${trade.status}">${trans[trade.status]}</td>
            <td>${trade.time}</td>
        `;
        tradesList.appendChild(tradeEl);
    });
}

// Update markets list
function updateMarketsList() {
    if (!marketsList) return;

    const language = localStorage.getItem('language') || 'en';
    const trans = translations[language];
    marketsList.innerHTML = '';
    Object.keys(assetPriceData).forEach(pair => {
        const assetData = assetPriceData[pair];
        const price = (assetData.basePrice + (Math.random() * assetData.volatility - assetData.volatility / 2)).toFixed(2);
        const change = ((Math.random() - 0.5) * 5).toFixed(2);
        const volume = (Math.random() * 1000000).toFixed(0);
        const marketEl = document.createElement('tr');
        marketEl.innerHTML = `
            <td class="pair">${trans[pair.toLowerCase().replace('/', '_')]}</td>
            <td>$${price}</td>
            <td class="${change >= 0 ? 'profit' : 'loss'}">${change >= 0 ? '+' : ''}${change}%</td>
            <td>${volume} USDT</td>
        `;
        marketsList.appendChild(marketEl);
    });
}

// Update portfolio list
function updatePortfolioList() {
    if (!portfolioList) return;

    const language = localStorage.getItem('language') || 'en';
    const trans = translations[language];
    portfolioList.innerHTML = '';
    let totalValueUSD = 0;

    Object.keys(portfolioData).forEach(asset => {
        const data = portfolioData[asset];
        const currentPrice = assetPriceData[`${asset}/USDT`].basePrice + (Math.random() * assetPriceData[`${asset}/USDT`].volatility - assetPriceData[`${asset}/USDT`].volatility / 2);
        const value = (data.amount * currentPrice).toFixed(2);
        totalValueUSD += parseFloat(value);
        const change = ((Math.random() - 0.5) * 5).toFixed(2);
        const portfolioEl = document.createElement('tr');
        portfolioEl.innerHTML = `
            <td>${asset}</td>
            <td>${data.amount.toFixed(4)} ${asset}</td>
            <td>$${value}</td>
            <td class="${change >= 0 ? 'profit' : 'loss'}">${change >= 0 ? '+' : ''}${change}%</td>
        `;
        portfolioList.appendChild(portfolioEl);
    });

    if (portfolioBalanceEl && portfolioValueEl) {
        const balanceSOL = currentUser ? (currentUser.balance / assetPriceData['SOL/USDT'].usdValue).toFixed(2) : (totalValueUSD / assetPriceData['SOL/USDT'].usdValue).toFixed(2);
        portfolioBalanceEl.textContent = `${balanceSOL} SOL`;
        portfolioValueEl.textContent = `≈ $${totalValueUSD.toFixed(2)}`;
    }
}

// Handle trade
function handleTrade(type) {
    if (!amountInput || !durationSelect || !assetPairSelect) return;

    const language = localStorage.getItem('language') || 'en';
    const trans = translations[language];
    if (!currentUser) {
        alert(trans.connect_wallet_first);
        return;
    }

    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        alert(trans.invalid_amount);
        return;
    }

    const asset = currentAssetPair.split('/')[0];
    const balanceInAsset = currentUser.balance / assetPriceData[currentAssetPair].usdValue;

    if (amount > balanceInAsset) {
        alert(trans.insufficient_balance);
        return;
    }

    console.log(`Placing ${type} order:`, {
        pair: currentAssetPair,
        amount,
        duration: durationSelect.value,
        type
    });

    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const price = assetPriceData[currentAssetPair].basePrice + (Math.random() * assetPriceData[currentAssetPair].volatility - assetPriceData[currentAssetPair].volatility / 2);

    mockTrades.unshift({
        id: Date.now(),
        pair: currentAssetPair,
        type,
        amount,
        price: price.toFixed(2),
        time: timeString,
        status: 'pending'
    });

    updateTradeHistory();

    currentUser.balance -= amount * assetPriceData[currentAssetPair].usdValue;
    updateBalance(currentUser.balance);

    alert(`${trans.successful_trade} ${trans[type]} ${trans.order_for} ${amount} ${asset}`);
}

// Calculate payout
function calculatePayout() {
    if (!payoutAmountEl || !amountInput) return;

    const language = localStorage.getItem('language') || 'en';
    const trans = translations[language];
    const amount = parseFloat(amountInput.value) || 0;
    const asset = currentAssetPair.split('/')[0];
    const payout = (amount * 1.7).toFixed(3);
    payoutAmountEl.textContent = `+70% / ${payout} ${asset}`;
}

// Update amount suffix based on selected asset pair
function updateAmountSuffix() {
    if (!amountSuffixEl) return;
    const asset = currentAssetPair.split('/')[0];
    amountSuffixEl.textContent = asset;
}

// Event Listeners
function setupEventListeners() {
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentUser && loginModal) {
                loginModal.style.display = 'flex';
            }
        });
    }
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const language = localStorage.getItem('language') || 'en';
            const trans = translations[language];
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (login(username, password)) {
                alert(trans.wallet_connected_success);
            } else {
                alert(trans.wallet_connection_failed);
            }
        });
    }
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'none';
        });
    }
    if (loginModal) {
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }
    if (depositBtn) {
        depositBtn.addEventListener('click', () => {
            const language = localStorage.getItem('language') || 'en';
            const trans = translations[language];
            alert(trans.deposit_coming_soon);
        });
    }
    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', () => {
            const language = localStorage.getItem('language') || 'en';
            const trans = translations[language];
            alert(trans.withdraw_coming_soon);
        });
    }
    if (buyBtn) {
        buyBtn.addEventListener('click', () => handleTrade('buy'));
    }
    if (sellBtn) {
        sellBtn.addEventListener('click', () => handleTrade('sell'));
    }
    if (amountInput) {
        amountInput.addEventListener('input', calculatePayout);
    }
    if (durationSelect) {
        durationSelect.addEventListener('change', calculatePayout);
    }
    if (assetPairSelect) {
        assetPairSelect.addEventListener('change', () => {
            currentAssetPair = assetPairSelect.value;
            updateAmountSuffix();
            updateChartData(candleSeries);
            calculatePayout();
        });
    }
    if (tabs) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentTab = tab.dataset.tab;
            });
        });
    }
}

// Initialize the app
let candleSeries = null;
function init() {
    initLanguage();

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage === 'index.html') {
        const chartObj = initChart();
        if (chartObj) {
            candleSeries = chartObj.candleSeries;
            updateChartData(candleSeries);
            updateTradeHistory();
            updateAmountSuffix();
            calculatePayout();

            setInterval(() => {
                if (chartData) {
                    const newCandle = generateNewCandle(chartData);
                    candleSeries.update(newCandle);
                    chartData.push(newCandle);
                    if (chartData.length > 100) chartData.shift();

                    if (priceChangeEl) {
                        const priceChange = ((newCandle.close - chartData[0].open) / chartData[0].open * 100).toFixed(2);
                        priceChangeEl.textContent = `${priceChange > 0 ? '+' : ''}${priceChange}%`;
                        priceChangeEl.style.color = priceChange >= 0 ? '#0cbc87' : '#f6465d';
                    }
                }
            }, 1000);
        }
    } else if (currentPage === 'markets.html') {
        updateMarketsList();
        setInterval(updateMarketsList, 5000);
    } else if (currentPage === 'portfolio.html') {
        updatePortfolioList();
        setInterval(updatePortfolioList, 5000);
    }

    setupEventListeners();
}

// Start the app
init();
