import requests


def check_is_msp(document_number):
    url_for_request = 'https://rmsp.nalog.ru/search-proc.json?query={}'
    response = requests.get(url_for_request.format(document_number))
    return bool(response.json()['data'])


def convert_document_type_into_сyrillic(docyment_type):
    if docyment_type == "INN":
        return "ИНН"
    elif docyment_type == "OGRN":
        return "ОГРН"
    else:
        return None
