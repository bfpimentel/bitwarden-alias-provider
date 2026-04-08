FROM docker.io/library/python:3.12-slim

WORKDIR /app

COPY server/pyproject.toml /app/
COPY server/app.py /app/
COPY server/providers /app/providers

RUN pip install .

EXPOSE 6123

CMD ["python", "app.py"]
