FROM python:3.12-slim

WORKDIR /app

COPY .env /app/
COPY server/pyproject.toml /app/
COPY server/app.py /app/
COPY server/providers /app/providers

RUN pip install --no-cache-dir .

EXPOSE 6123

CMD ["python", "app.py"]
