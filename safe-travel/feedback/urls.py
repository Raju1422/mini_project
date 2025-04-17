from django.urls import path
from .views import ReviewCreateListView,IncidentReportView

urlpatterns = [
    path('reviews/', ReviewCreateListView.as_view(), name='review-list-create'),
    path('incident-report/', IncidentReportView.as_view(), name='incident-report')
]
