import requests

API_KEY = 'YOUR_API_KEY'
BASE_URL = 'https://www.alphavantage.co/query'

def get_stock_data(symbol):
    params = {
        'function': 'TIME_SERIES_INTRADAY',
        'symbol': symbol,
        'interval': '1min',
        'apikey': API_KEY,
    }
    response = requests.get(BASE_URL, params=params)
    data = response.json()
    # Extract price data as per API response structure
    return float(data['Time Series (1min)']['latest_price']) if data else None
