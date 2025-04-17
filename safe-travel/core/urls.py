from django.urls import path
from .views import AnalyzeRoutesView

urlpatterns = [
    path('analyze-routes/', AnalyzeRoutesView.as_view(), name='analyze-routes'),
]
