# from rest_framework import serializers
# from .models import IncidentReport,Review

# class IncidentReportSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = IncidentReport
#         fields = ['id', 'user', 'incident_type', 'location', 'description', 'coordinates_lat', 'coordinates_lng', 'created_at', 'image']
#         read_only_fields = ['user']  # Make sure the user field is read-only, it's set in the view


# class ReviewSerializer(serializers.ModelSerializer):
#     username = serializers.CharField(source='user.username', read_only=True)

#     class Meta:
#         model = Review
#         fields = ['id', 'username', 'review_type', 'description', 'rating', 'created_at']
#         read_only_fields = ['id', 'username', 'created_at']

# class CreateReviewSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Review
#         fields = ['review_type', 'description', 'rating']