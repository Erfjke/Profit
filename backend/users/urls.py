
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import UserRetrieveUpdateDestroyAPIView, LoginView, LogoutView, RegisterView, check_username, \
    UserViewSet
router = DefaultRouter()
router.register(r'users', UserViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path('reg/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    # path('profile/', ProfileView.as_view()),  # Новый эндпоинт
    # path('<int:pk>/', UserRetrieveUpdateDestroyAPIView.as_view(), name="user"),
    path('profile/', UserRetrieveUpdateDestroyAPIView.as_view(), name="user"),
    path('logout', LogoutView.as_view()),
    path('check-username', check_username, name='check_username'),

]
