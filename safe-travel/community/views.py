# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework.generics import ListCreateAPIView
# from .models import IncidentReport,Review
# from .serializers import IncidentReportSerializer,ReviewSerializer,CreateReviewSerializer
# from rest_framework.parsers import MultiPartParser,FileUploadParser,FormParser
# from rest_framework import permissions

# class IncidentReportView(ListCreateAPIView):
#     queryset = IncidentReport.objects.all()
#     serializer_class = IncidentReportSerializer
#     parser_classes =[MultiPartParser,FormParser]
#     permission_classes = [permissions.IsAuthenticated]
#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)
#     # def post(self, request, *args, **kwargs):
#     #     serializer = IncidentReportSerializer(data=request.data)
#     #     if serializer.is_valid():
#     #         # Save the incident report instance
#     #         serializer.save(user=request.user)
#     #         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     #     else:
#     #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class CreateReviewView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         serializer = CreateReviewSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(user=request.user)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# class AllUserReviewsView(APIView): 
#     def get(self, request):
#         reviews = Review.objects.all()  # Fetch all reviews
#         serializer = ReviewSerializer(reviews, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
    

# class ReviewCountView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     def get(self, request):
#         positive_reviews_count = Review.objects.filter(review_type="Positive").count()
#         negative_reviews_count = Review.objects.filter(review_type="Negative").count()
#         data = {
#             "positive_reviews": positive_reviews_count,
#             "negative_reviews": negative_reviews_count,
#         }
#         return Response(data, status=200)


