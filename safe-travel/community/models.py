# from django.db import models
# from django.contrib.auth import get_user_model
# import uuid
# User = get_user_model()
# INCIDENT_TYPE_CHOICES = [
#         ('Accident', 'Accident'),
#         ('Harassment', 'Harassment'),
#         ('Theft', 'Theft'),
#         ('Vandalism', 'Vandalism'),
#         ('Other', 'Other'),
#     ]
# class IncidentReport(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     incident_type = models.CharField(max_length=50, choices=INCIDENT_TYPE_CHOICES)
#     location = models.CharField(max_length=255)
#     description = models.TextField()
#     coordinates_lat = models.FloatField()
#     coordinates_lng = models.FloatField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     image = models.ImageField(upload_to='incident_images/',null=True)

#     def __str__(self):
#         return f"{self.incident_type} - {self.location}"
    






