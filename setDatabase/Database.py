import cx_Oracle
import json
from datetime import datetime

dsn = cx_Oracle.makedsn('localhost', '1521', service_name='xe')
connection = cx_Oracle.connect(user='minipro', password='1234', dsn=dsn)

cursor = connection.cursor()

# 오라클 테이블들
queries = {
    "BOOK": "SELECT * FROM BOOK",
    "CONTRACT": "SELECT * FROM CONTRACT",
    "DELIVERY_OPTIONS": "SELECT * FROM DELIVERY_OPTIONS",
    "DELIVERY_RECEIPT": "SELECT * FROM DELIVERY_RECEIPT",
    "DETAIL_PURCHASE": "SELECT * FROM DETAIL_PURCHASE",
    "HOLIDAYS": "SELECT * FROM HOLIDAYS",
    "MEMBER": "SELECT * FROM MEMBER",
    "PUBLISHER": "SELECT * FROM PUBLISHER",
    "PURCHASE": "SELECT * FROM PURCHASE",
    "NAVER_BOOK": "SELECT * FROM NAVER_BOOK",
}

data = {}

def datetime_converter(obj):
    if isinstance(obj, datetime):
        return obj.strftime('%Y-%m-%d %H:%M:%S')
    raise TypeError("Type not serializable")

for table, query in queries.items():
    cursor.execute(query)
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # 컬럼
    table_data = [dict(zip(columns, row)) for row in rows]  # 각 행을 딕셔너리
    data[table] = table_data  # 테이블 이름 = 키

with open('data.json', 'w', encoding='utf-8') as json_file:
    json.dump(data, json_file, ensure_ascii=False, indent=4, default=datetime_converter)

cursor.close()
connection.close()