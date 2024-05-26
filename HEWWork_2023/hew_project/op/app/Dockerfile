FROM python:3.10

WORKDIR /app

COPY app/requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

CMD ["waitress-serve", "--host", "0.0.0.0", "--port", "8080","app:app"]