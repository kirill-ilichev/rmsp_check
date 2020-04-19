FROM python:3.6

ENV PYTHONUNBUFFERED 1
ENV TZ Europe/Moscow

RUN mkdir /code/
WORKDIR /code/

COPY . /code/
RUN pip install --no-cache-dir -r requirements.txt
