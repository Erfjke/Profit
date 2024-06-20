# models.py
from django.db import models

class Route(models.Model):
    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255)
    passenger_flow = models.IntegerField()
    class Meta:
        ordering = ['-id']  # Сортировка по id, от новейшего к старейшему

    def __str__(self):
        return f'{self.start_location} to {self.end_location}'

class Transport(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    costs = models.DecimalField(max_digits=10, decimal_places=2)
    transport_date = models.DateField()
    departure_time = models.TimeField()  # Время отправления
    arrival_time = models.TimeField()    # Время прибытия
    fare = models.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        ordering = ['-id']  # Сортировка по id, от новейшего к старейшему
    def __str__(self):
        return f'{self.route} on {self.transport_date} from {self.departure_time} to {self.arrival_time}'


class Forecast(models.Model):
    transport_id = models.ForeignKey(Transport, on_delete=models.CASCADE)
    predicted_revenue = models.DecimalField(max_digits=10, decimal_places=2)
    predicted_passenger_flow = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    predicted_profitability = models.DecimalField(max_digits=5,decimal_places=2)

    def __str__(self):
        return f'Forecast for {self.transport} created on {self.created_at}'
