import json

from django.http import HttpResponse
from django.views.generic import ListView
from django.core.cache import cache
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django.conf import settings

from .models import RmspQuery
from .helpers import check_is_msp, convert_document_type_into_сyrillic


CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)


class HomeView(ListView):
    """
    Render page with queries list from all users
    and form to check is INN or OGRN subject is small or medium-sized enterprise
    """
    template_name = 'rmsp_check/index.html'
    model = RmspQuery

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        document_number = data['number']
        document_type = data['type']
        is_from_cache = False
        if document_number in cache:
            is_msp = cache.get(document_number)
            is_from_cache = True
        else:
            is_msp = check_is_msp(document_number)
            RmspQuery.objects.create(
                document_type=document_type,
                document_number=document_number,
                is_msp=is_msp
            )
            cache.set(document_number, is_msp, timeout=CACHE_TTL)
        query_data = {
            'document_type': convert_document_type_into_сyrillic(document_type),
            'document_number': document_number,
            'is_msp': "Да" if is_msp else "Нет",
            'is_from_cache': is_from_cache
        }
        return HttpResponse(json.dumps(query_data))
