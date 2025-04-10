import requests
import cx_Oracle
import json

# 네이버 API 정보
CLIENT_ID = 'HweKSxPk9GkzzKdrNaKN'  # 네이버 클라이언트 ID
CLIENT_SECRET = 'XbK64x8JPM'  # 네이버 클라이언트 Secret

# 오라클 DB 연결 정보
DB_USER = 'minipro'  # DB 사용자명
DB_PASSWORD = '1234'  # DB 비밀번호
DB_HOST = 'localhost'  # DB 호스트
DB_PORT = '1521'  # DB 포트
DB_SID = 'xe'  # DB SID

# 네이버 API URL (최신 책 1권)
url = "https://openapi.naver.com/v1/search/book.json"
params = {
    'query': '생일 그리고 축복',  # 검색할 책 제목
    'display': 1,  # 검색 결과 갯수
    'sort': 'date'  # 정렬 기준 (최신순)
}

headers = {
    'X-Naver-Client-Id': 'HweKSxPk9GkzzKdrNaKN',
    'X-Naver-Client-Secret': 'XbK64x8JPM'
}

# 네이버 API 호출
response = requests.get(url, headers=headers, params=params)

# 응답 결과 확인
if response.status_code == 200:
    data = response.json()
    # 첫 번째 책 정보 가져오기
    book = data['items'][0]

    # 필요한 데이터 추출
    isbn = book['isbn'].split(' ')[0]  # ISBN은 공백이 포함되므로 첫 번째 부분만 가져오기
    title = book['title']
    author = book['author']
    image = book['image']
    discount = float(book['discount']) if book['discount'] else None  # 할인 가격은 숫자로 변환 (없을 경우 None)
    description = book['description']
    publisher = book['publisher']
    pubdate = book['pubdate']  # 날짜는 그대로 사용, 'YYYYMMDD' 형식

    # 오라클 DB 연결
    try:
        # DB 연결
        conn = cx_Oracle.connect(DB_USER, DB_PASSWORD, f"{DB_HOST}:{DB_PORT}/{DB_SID}")
        cursor = conn.cursor()

        # 데이터 삽입 쿼리
        insert_query = """
        INSERT INTO NAVER_BOOK (
            NB_ISBN, NB_TITLE, NB_AUTHOR, NB_IMAGE, 
            NB_PRICE, NB_DESCRIPTION, NB_PUBLISHER, NB_PUBDATE
        ) VALUES (
            :isbn, :title, :author, :image,  
            :discount, :description, :publisher, TO_DATE(:pubdate, 'YYYYMMDD')
        )
        """

        # 쿼리에 바인딩할 데이터
        cursor.execute(insert_query, {
            'isbn': isbn,
            'title': title,
            'author': author,
            'image': image,
            'discount': discount,  # 'discount' 값을 'price' 컬럼에 넣음
            'description': description,
            'publisher': publisher,
            'pubdate': pubdate
        })

        # 커밋하여 데이터베이스에 반영
        conn.commit()

        print(f"책 '{title}' 데이터가 성공적으로 삽입되었습니다.")

    except cx_Oracle.Error as error:
        print(f"오라클 DB 오류: {error}")

    finally:
        # 연결 종료
        if cursor:
            cursor.close()
        if conn:
            conn.close()

else:
    print(f"API 호출 실패: {response.status_code}")