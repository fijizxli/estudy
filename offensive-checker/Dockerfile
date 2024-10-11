FROM python:3.10-slim
WORKDIR /app
COPY . .

RUN pip install --no-cache-dir --only-binary :all: -r requirements.txt && pip install --no-cache-dir torch==2.4.1+cpu --index-url https://download.pytorch.org/whl/cpu

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081"]
