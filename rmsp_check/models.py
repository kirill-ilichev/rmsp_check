from django.db import models


class RmspQuery(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ('OGRN', 'ОГРН'),
        ('INN', 'ИНН'),
    ]
    document_type = models.CharField(
        "Тип документа",
        max_length=4,
        choices=DOCUMENT_TYPE_CHOICES
    )
    document_number = models.BigIntegerField('Номер документа')
    is_msp = models.BooleanField("Является ли субъект представителем малого или среднего предпринимательства")
    created_at = models.DateTimeField('Дата запроса', auto_now_add=True)

    def get_document_type_verbose(self):
        return dict(RmspQuery.DOCUMENT_TYPE_CHOICES)[self.document_type]

    class Meta:
        ordering = ['-created_at']

