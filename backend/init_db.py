import sqlite3

# 1. Kết nối và tạo file cơ sở dữ liệu
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# 2. Xóa bảng cũ nếu tồn tại (để làm mới hoàn toàn)
cursor.execute('DROP TABLE IF EXISTS Products')

# 3. Viết câu lệnh SQL tạo bảng Products
cursor.execute('''
    CREATE TABLE Products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id TEXT,
        name TEXT,
        price TEXT,
        sku TEXT,
        image_url TEXT,
        is_bestseller BOOLEAN,
        is_new_arrival BOOLEAN
    )
''')

# 4. Chèn dữ liệu mẫu (Sử dụng lệnh INSERT SQL)
products = [
    ('ao', 'Áo kiểu nữ họa tiết hoa cổ V phối nơ', '350.000đ', 'RR26AK46', 'web_img/San_Pham_Ban_Chay/ao/ao-nu.webp', True, False),
    ('ao', 'Áo sơ mi lụa tơ phối ren cao cấp', '480.000đ', 'RR26AS09', 'web_img/San_Pham_Ban_Chay/ao/ao-kieu-nu-org.webp', False, True),
    ('dam', 'Đầm hồng xô thêu dáng xòe tiểu thư', '700.000đ', 'RR26QN09', 'web_img/San_Pham_Ban_Chay/dam_hong/dam-hong-xo-theu-dang-xoe-phoi-dang-ten-kk188-07.webp', True, False),
    ('chanvay', 'Chân váy dáng xòe linen thêu hoa', '460.000đ', 'RR26QN11', 'web_img/San_Pham_Ban_Chay/chan_vay/chan-vay-dang-xoe-linen-theu-cv11-39.webp', True, True)
]

cursor.executemany('''
    INSERT INTO Products (category_id, name, price, sku, image_url, is_bestseller, is_new_arrival)
    VALUES (?, ?, ?, ?, ?, ?, ?)
''', products)

# 5. Lưu lại và đóng kết nối
conn.commit()
conn.close()

print("Đã tạo Cơ sở dữ liệu và nạp sản phẩm thành công!")