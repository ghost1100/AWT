from venv import create
import _sqlite3

conn =  _sqlite3.connect('Database.db')
print ("Connection was a success..")

conn.execute("""CREATE TABLE IF NOT EXISTS Events(
             ID INTEGER PRIMARY KEY AUTOINCREMENT,
             Title text NOT NULL,
             Description text NOT NULL,
            Start_Date datetime, 
             End_Date datetime
             );""")

conn.execute("""CREATE TABLE IF NOT EXISTS ToDo(
             TaskID INTEGER PRIMARY KEY AUTOINCREMENT,
             Description Text NOT NULL,
             DueDate DATE,
             Status BOOLEAN DEFAULT FALSE
             );""")
print ("Tables Created Successfully")
conn.commit()
conn.close()
