import requests
import cx_Oracle
import json
from config import config

def run():
    naver = config.NAVER_API
    db = config.DB_CONFIG

    url = "https://openapi.naver.com/v1/search/book.json"
    params = {
        'query': '정의란 무엇인가',
        'display': 1,  # 일단 1개
        'sort': 'date'  # 정렬 기준 (최신순)
    }

    headers = {
        'X-Naver-Client-Id': naver['CLIENT_ID'],
        'X-Naver-Client-Secret': naver['CLIENT_SECRET']
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        data = response.json()
        book = data['items'][0]

        isbn = book['isbn'].split(' ')[0]
        title = book['title']
        author = book['author']
        image = book['image']
        discount = float(book['discount']) if book['discount'] else None  # 할인 가격은 숫자로 변환 (없을 경우 None)
        description = book['description']
        publisher = book['publisher']
        pubdate = book['pubdate']

        try:
            dsn = cx_Oracle.makedsn(db['HOST'], db['PORT'], service_name=db['SERVICE'])
            conn = cx_Oracle.connect(db['USER'], db['PASSWORD'], dsn=dsn)
            cursor = conn.cursor()

            insert_query = """
            INSERT INTO NAVER_BOOK (
                NB_ISBN, NB_TITLE, NB_AUTHOR, NB_IMAGE, 
                NB_PRICE, NB_DESCRIPTION, NB_PUBLISHER, NB_PUBDATE
            ) VALUES (
                :isbn, :title, :author, :image,  
                :discount, :description, :publisher, TO_DATE(:pubdate, 'YYYYMMDD')
            )
            """

            cursor.execute(insert_query, {
                'isbn': isbn,
                'title': title,
                'author': author,
                'image': image,
                'discount': discount,
                'description': description,
                'publisher': publisher,
                'pubdate': pubdate
            })

            conn.commit()

            print(f"책 '{title}' 데이터가 성공적으로 삽입되었습니다.")

        except cx_Oracle.Error as error:
            print(f"오라클 DB 오류: {error}")

        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    else:
        print(f"API 호출 실패: {response.status_code}")