FROM python:3.11

WORKDIR /app/backend

COPY ./backend/requirements.txt ./

RUN pip install -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--reload"]