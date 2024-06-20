from datetime import datetime

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from rest_framework import viewsets, permissions, status
from .models import Route, Transport, Forecast
from .serializer import RouteSerializer, TransportSerializer,  ForecastSerializer
from .forecasting_service import predict_profitability
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
import matplotlib.pyplot as plt
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from django.utils import timezone
import  io
class RouteViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Route.objects.all().order_by('-id')
    serializer_class = RouteSerializer

class TransportViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Transport.objects.all().order_by('-id')
    serializer_class = TransportSerializer



class ForecastViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Forecast.objects.all().order_by('-id')
    serializer_class = ForecastSerializer


class ForecastPredictionViewSet(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ForecastSerializer
    def post(self, request):
        data = request.data
        transport_id = data.get('transport_id')
        model_type = data.get('model')
        parameters = data.get('parameters')

        forecast_result = predict_profitability(transport_id, model_type, parameters)
        return Response(forecast_result)

class AnalyticsDataView(APIView):
    def get(self, request, *args, **kwargs):
        transports = Transport.objects.all()
        forecasts = Forecast.objects.all()

        # Рассчитываем общие затраты, общую выручку и среднюю рентабельность
        total_costs = sum([transport.costs for transport in transports])
        total_revenue = sum([forecast.predicted_revenue for forecast in forecasts])
        avg_profitability = sum([forecast.predicted_profitability for forecast in forecasts]) / len(forecasts) if forecasts else 0

        data = {
            'total_costs': total_costs,
            'total_revenue': total_revenue,
            'avg_profitability': avg_profitability,
        }

        return Response(data)


class RouteLoadView(APIView):

    def get(self, request, *args, **kwargs):
        routes = Route.objects.all()

        data = [
            {
                "route": f"{route.start_location} - {route.end_location}",
                "passenger_flow": route.passenger_flow
            }
            for route in routes
        ]
        return Response(data)

class RevenueCostsView(APIView):
    def get(self, request, *args, **kwargs):
        transports = Transport.objects.all()
        data = {}
        for transport in transports:
            route = f"{transport.route.start_location} - {transport.route.end_location}"
            if route not in data:
                data[route] = {"revenue": 0, "costs": 0}
            data[route]["revenue"] += (transport.fare * transport.route.passenger_flow)
            data[route]["costs"] += transport.costs
        return Response(data)

class AverageTravelTimeView(APIView):
    def get(self, request, *args, **kwargs):
        routes = Route.objects.all()
        data = []
        for route in routes:
            transports = Transport.objects.filter(route=route)
            if transports:
                avg_travel_time = sum(
                    (t.arrival_time.hour*60 + t.arrival_time.minute) - (t.departure_time.hour*60 + t.departure_time.minute) for t in transports
                ) / len(transports)
                data.append({
                    "route": f"{route.start_location} - {route.end_location}",
                    "avg_travel_time": avg_travel_time
                })

        return Response(data)

class PassengerFlowTrendsView(APIView):
    def get(self, request, *args, **kwargs):
        routes = Route.objects.all()
        data = []
        for route in routes:
            transports = Transport.objects.filter(route=route).order_by('transport_date')
            passenger_flows = [
                {
                    "date": transport.transport_date,
                    "passenger_flow": transport.route.passenger_flow
                }
                for transport in transports
            ]
            data.append({
                "route": f"{route.start_location} - {route.end_location}",
                "passenger_flows": passenger_flows
            })
        return Response(data)

class ProfitabilityByRouteView(APIView):
    def get(self, request, *args, **kwargs):
        routes = Route.objects.all()
        data = []
        for route in routes:
            transports = Transport.objects.filter(route=route)
            total_revenue = sum(t.fare * t.route.passenger_flow for t in transports)
            total_costs = sum(t.costs for t in transports)
            if total_costs > 0:
                profitability = ((total_revenue - total_costs) / total_costs) * 100
            else:
                profitability = 0
            data.append({
                "route": f"{route.start_location} - {route.end_location}",
                "profitability": profitability
            })
        return Response(data)



class TransportListView(APIView):
    def get(self, request, *args, **kwargs):
        transports = Transport.objects.all()
        data = [
            {
                'id': transport.id,
                'route': f'{transport.route.start_location} - {transport.route.end_location}',
                'transport_date': transport.transport_date,
                'departure_time': transport.departure_time,
                'arrival_time': transport.arrival_time,
                'costs': transport.costs,
                'fare': transport.fare,
                'passenger_flow': transport.route.passenger_flow,
            }
            for transport in transports
        ]
        return Response(data)
class TransportDetailView(APIView):
    def get(self, request, pk, *args, **kwargs):
        transport = Transport.objects.get(pk=pk)
        data = {
            'route': f'{transport.route.start_location} - {transport.route.end_location}',
            'transport_date': transport.transport_date,
            'departure_time': transport.departure_time,
            'arrival_time': transport.arrival_time,
            'costs': transport.costs,
            'fare': transport.fare,
            'passenger_flow': transport.route.passenger_flow,
        }
        return Response(data)




# Устанавливаем бэкэнд Agg для matplotlib
plt.switch_backend('Agg')
class GenerateReportView(APIView):
    def get(self, request, pk):
        try:
            transport = Transport.objects.get(pk=pk)
            # Путь к файлу шрифта DejaVuSans
            font_path = "D:\\forecasting_profitability\\backend\\backend_api\\DejaVuSans.ttf"

            # Регистрация шрифта
            pdfmetrics.registerFont(TTFont('DejaVuSans', font_path))

            # Создание буфера для PDF
            buffer = io.BytesIO()

            # Создание PDF объекта
            p = canvas.Canvas(buffer, pagesize=letter)
            width, height = letter

            # Добавление текущей даты в шапку
            current_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            p.setFont("DejaVuSans", 12)
            p.drawString(30, height - 30, f"Дата отчета: {current_date}")

            # Центрирование заголовка отчета
            p.setFont("DejaVuSans", 16)
            p.drawCentredString(width / 2.0, height - 50, "Отчет по перевозкам")

            # Добавление информации о перевозке
            y_position = height - 80
            line_height = 18

            p.setFont("DejaVuSans", 12)
            p.drawString(30, y_position, f"Отчет о перевозке для {transport.route}")
            y_position -= line_height
            p.drawString(30, y_position, f"Дата перевозки: {transport.transport_date}")
            y_position -= line_height
            p.drawString(30, y_position, f"Время отправления: {transport.departure_time}")
            y_position -= line_height
            p.drawString(30, y_position, f"Время прибытия: {transport.arrival_time}")
            y_position -= line_height
            p.drawString(30, y_position, f"Стоимость проезда: {transport.fare}")
            y_position -= line_height
            p.drawString(30, y_position, f"Расходы: {transport.costs}")

            # Добавление информации о прогнозируемой рентабельности
            forecast = Forecast.objects.filter(transport_id=transport.id).first()
            if forecast:
                y_position -= line_height
                p.drawString(30, y_position, f"Прогнозируемая рентабельность: {forecast.predicted_profitability}%")
                y_position -= line_height
                p.drawString(30, y_position, f"Прогнозируемый пассажиропоток: {forecast.predicted_passenger_flow}")
                y_position -= line_height
                p.drawString(30, y_position, f"Прогнозируемая выручка: {forecast.predicted_revenue}")

            # Генерация диаграммы "Пассажиропоток, Стоимость проезда, Расходы"
            plt.figure(figsize=(6, 4))
            labels = ['Пассажиропоток', 'Стоимость проезда', 'Расходы']
            values = [transport.route.passenger_flow, transport.fare, transport.costs]
            plt.bar(labels, values, color=['#FF9999', '#66B2FF', '#99FF99'])
            plt.title('Данные о перевозке')
            plt.xlabel('Метрики')
            plt.ylabel('Значения')

            # Сохранение диаграммы в буфер
            chart_buffer = io.BytesIO()
            plt.savefig(chart_buffer, format='png')
            chart_buffer.seek(0)
            plt.close()

            # Добавление диаграммы на PDF
            p.drawImage(ImageReader(chart_buffer), 30, y_position - 320, width=500, height=300)

            # Генерация диаграммы "Доходы и Расходы"
            plt.figure(figsize=(6, 4))
            labels = ['Доходы', 'Расходы']
            values = [forecast.predicted_revenue, transport.costs] if forecast else [0, transport.costs]
            plt.bar(labels, values, color=['#4CAF50', '#F44336'])
            plt.title('Доходы и Расходы')
            plt.xlabel('Метрики')
            plt.ylabel('Значения')

            # Сохранение диаграммы в буфер
            income_expense_chart_buffer = io.BytesIO()
            plt.savefig(income_expense_chart_buffer, format='png')
            income_expense_chart_buffer.seek(0)
            plt.close()

            # Добавление диаграммы на PDF
            p.drawImage(ImageReader(income_expense_chart_buffer), 30, y_position - 650, width=500, height=300)

            # Закрытие PDF объекта
            p.showPage()
            p.save()

            # Получение значения буфера BytesIO и запись его в ответ
            buffer.seek(0)
            return HttpResponse(buffer, content_type='application/pdf')
        except Transport.DoesNotExist:
            return Response({'error': 'Перевозка не найдена'}, status=status.HTTP_404_NOT_FOUND)


class GeneratePeriodReportView(APIView):
    def post(self, request):
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        if not start_date or not end_date:
            return Response({'error': 'Необходимо указать начальную и конечную даты'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            start_date = timezone.make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
            end_date = timezone.make_aware(datetime.strptime(end_date, '%Y-%m-%d'))
            transports = Transport.objects.filter(transport_date__range=[start_date, end_date])

            if not transports.exists():
                return Response({'error': 'За указанный период перевозок не найдено'}, status=status.HTTP_404_NOT_FOUND)

            buffer = io.BytesIO()
            p = canvas.Canvas(buffer, pagesize=letter)
            width, height = letter
            font_path = "D:\\forecasting_profitability\\backend\\backend_api\\DejaVuSans.ttf"

            # Регистрация шрифта
            pdfmetrics.registerFont(TTFont('DejaVuSans', font_path))

            current_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            p.setFont("DejaVuSans", 12)
            p.drawString(30, height - 30, f"Дата отчета: {current_date}")

            p.setFont("DejaVuSans", 16)
            p.drawCentredString(width / 2.0, height - 50, "Отчет по перевозкам за период")

            y_position = height - 80
            line_height = 18

            total_passenger_flow = 0
            total_fare = 0
            total_costs = 0
            count = transports.count()

            for transport in transports:
                total_passenger_flow += transport.route.passenger_flow
                total_fare += transport.fare
                total_costs += transport.costs

            average_passenger_flow = total_passenger_flow / count
            average_fare = total_fare / count
            average_costs = total_costs / count

            p.setFont("DejaVuSans", 12)
            p.drawString(30, y_position, f"Период: с {start_date.date()} по {end_date.date()}")
            y_position -= line_height
            p.drawString(30, y_position, f"Средний пассажиропоток: {average_passenger_flow:.2f}")
            y_position -= line_height
            p.drawString(30, y_position, f"Средняя стоимость проезда: {average_fare:.2f}")
            y_position -= line_height
            p.drawString(30, y_position, f"Средние расходы: {average_costs:.2f}")

            plt.figure(figsize=(6, 4))
            labels = ['Пассажиропоток', 'Стоимость проезда', 'Расходы']
            values = [average_passenger_flow, average_fare, average_costs]
            plt.bar(labels, values, color=['#FF9999', '#66B2FF', '#99FF99'])
            plt.title('Средние значения за период')
            plt.xlabel('Метрики')
            plt.ylabel('Средние значения')

            chart_buffer = io.BytesIO()
            plt.savefig(chart_buffer, format='png')
            chart_buffer.seek(0)
            plt.close()

            p.drawImage(ImageReader(chart_buffer), 30, y_position - 320, width=500, height=300)

            p.showPage()
            p.save()

            buffer.seek(0)
            return HttpResponse(buffer, content_type='application/pdf')
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
