# models.py
from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()
class Review(models.Model):
    REVIEW_TYPE_CHOICES = (
        ('positive', 'Positive'),
        ('negative', 'Negative'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedback_reviews')
    review_type = models.CharField(max_length=10, choices=REVIEW_TYPE_CHOICES)
    description = models.TextField()
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.review_type} - {self.rating} stars"
    
class IncidentReport(models.Model):
    INCIDENT_CHOICES = [
        ("Accident", "Accident"),
        ("Harassment", "Harassment"),
        ("Theft", "Theft"),
        ("Vandalism", "Vandalism"),
        ("Other", "Other"),
    ]

    incident_type = models.CharField(max_length=50, choices=INCIDENT_CHOICES)
    location = models.TextField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.incident_type} at {self.location}"
    

class IncidentImage(models.Model):
    report = models.ForeignKey(IncidentReport, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='incident_images/')
