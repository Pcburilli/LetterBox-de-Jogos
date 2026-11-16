# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3-slim

EXPOSE 5000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Instala dependências do sistema necessárias para o psycopg2 / C
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala as dependências do Python
COPY requirements.txt .
RUN python -m pip install --no-cache-dir -r requirements.txt

# Define o diretório de trabalho e copia os arquivos do projeto
WORKDIR /app
COPY . /app

# Cria o usuário não-root e aplica as permissões DEPOIS de copiar o código
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
CMD ["gunicorn", "--reload", "--bind", "0.0.0.0:5000", "run:app"]