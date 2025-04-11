from api import NaverBook
from database import Database

if __name__ == "__main__":
  print("네이버 시작~")
  NaverBook.run()
  print("네이버 끝~")

  print("JSON 만들기 시작~")
  Database.run()
  print("JSON 만들기 끝~")