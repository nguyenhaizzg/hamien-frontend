from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app) # Cho phép Frontend truy cập

# Hàm phụ trợ để kết nối SQL
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row # Chuyển dữ liệu SQL thành dạng Dictionary (Key-Value) dễ đọc
    return conn

# API 1: Lấy sản phẩm theo danh mục (Ví dụ: /api/products?category=ao)
@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    conn = get_db_connection()
    
    if category:
        products = conn.execute('SELECT * FROM Products WHERE category_id = ?', (category,)).fetchall()
    else:
        products = conn.execute('SELECT * FROM Products').fetchall()
        
    conn.close()
    return jsonify([dict(p) for p in products])

# API 2: Lấy sản phẩm Bán Chạy
@app.route('/api/products/bestsellers', methods=['GET'])
def get_bestsellers():
    conn = get_db_connection()
    products = conn.execute('SELECT * FROM Products WHERE is_bestseller = 1').fetchall()
    conn.close()
    return jsonify([dict(p) for p in products])

if __name__ == '__main__':
    app.run(port=5000, debug=True)