from django.urls import path
from .views import ReviewCreateListView,IncidentReportView

urlpatterns = [
    path('reviews/', ReviewCreateListView.as_view(), name='create-review'),
    path('incident-report/', IncidentReportView.as_view(), name='incident-report')
]
