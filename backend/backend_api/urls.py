from rest_framework.routers import DefaultRouter
from django.urls import path, include

from .views import RouteViewSet, TransportViewSet, ForecastViewSet, ForecastPredictionViewSet, AnalyticsDataView, \
    RouteLoadView, RevenueCostsView, AverageTravelTimeView, PassengerFlowTrendsView, ProfitabilityByRouteView, \
    TransportDetailView, GenerateReportView, TransportListView, GeneratePeriodReportView

router = DefaultRouter()
router.register(r'routes', RouteViewSet)
router.register(r'transports', TransportViewSet)
router.register(r'forecasts', ForecastViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('predict/', ForecastPredictionViewSet.as_view()),
    path('analytics/', AnalyticsDataView.as_view(), name='analytics_data'),
    path('route-load/', RouteLoadView.as_view(), name='route_load'),
    path('revenue-costs/', RevenueCostsView.as_view(), name='revenue_costs'),
    path('average-travel-time/', AverageTravelTimeView.as_view(), name='average_travel_time'),
    path('passenger-flow-trends/', PassengerFlowTrendsView.as_view(), name='passenger_flow_trends'),
    path('profitability-by-route/', ProfitabilityByRouteView.as_view(), name='profitability_by_route'),
    path('transportsDetail/<int:pk>/', TransportDetailView.as_view(), name='transport-detail'),
    path('transportsList/', TransportListView.as_view(), name='transport-list'),
    path('generate-report/<int:pk>/', GenerateReportView.as_view(), name='generate-report'),
    path('generate-period-report/', GeneratePeriodReportView.as_view(), name='generate-period-report'),




]
