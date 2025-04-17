from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer,IncidentReportSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import IncidentReportSerializer
from rest_framework.parsers import MultiPartParser, FormParser
User = get_user_model()
class ReviewCreateListView(generics.ListCreateAPIView):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    # permission_classes = [permissions.IsAuthenticated]

    # def perform_create(self, serializer):
    #     serializer.save(user=self.request.user)
    def perform_create(self, serializer):
        print("Request Data:", self.request.data)
        user = self.request.user if self.request.user.is_authenticated else None

        if user is None:
            # Get or create a dummy user for "RGUKT"
            user, _ = User.objects.get_or_create(username="RGUKT")

        serializer.save(user=user)


class IncidentReportView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request):
        print(request.data)
        serializer = IncidentReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Incident reported successfully!'}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)