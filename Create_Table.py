from venv import create
import _sqlite3

conn =  _sqlite3.connect('Database.db')
print ("Connection was a success..")

conn.execute("""CREATE TABLE IF NOT EXISTS Events(
             ID INTEGER PRIMARY KEY AUTOINCREMENT,
             Day INTEGER NOT NULL,
             Month INTEGER NOT NULL,
             Year INTEGER NOT NULL,
             Event Text NOT NULL
             );""")
conn.execute("""CREATE TABLE IF NOT EXISTS ToDo(
             TaskID INTEGER PRIMARY KEY AUTOINCREMENT,
             TaskDescription Text NOT NULL,
             DueDate DATE,
             Priority  Text CHECK(Priority IN  ('High', 'Medium', 'Low')),
             Status  Text CHECK(Status IN  ('Not Started', 'In Progress', 'Completed')),
             EventID  INTEGER,
             FOREIGN KEY (EventID) REFERENCES Events(ID)  ON DELETE CASCADE ON UPDATE CASCADE
             );""")
print ("Tables Created Successfully")
conn.close()
