import { useState, useEffect } from 'react';

const API_KEY = 'YOUR_EXCHANGE_RATE_API_KEY'; // Bạn cần đăng ký API key từ một dịch vụ tỷ giá hối đoái
const BASE_URL = 'https://open.er-api.com/v6/latest';

interface ExchangeRates {
  [key: string]: number;
}

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Trong môi trường thực tế, hãy sử dụng API key thực
        // const response = await fetch(`${BASE_URL}?apikey=${API_KEY}`);
        // const data = await response.json();
        
        // Dữ liệu mẫu cho mục đích demo
        setTimeout(() => {
          setRates({
            USDT: 1,
            USD: 1.0,
            VND: 25000,
            CNY: 6.5,
            JPY: 110,
            EUR: 0.85,
            // Thêm các loại tiền tệ khác nếu cần
          });
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Không thể tải tỷ giá hối đoái');
        setLoading(false);
      }
    };

    fetchRates();
    // Cập nhật tỷ giá mỗi 5 phút
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { rates, loading, error };
}
