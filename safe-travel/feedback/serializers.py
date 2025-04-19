
import os
from PIL import Image
import torch
from torchvision import transforms
import torch.nn as nn
from torchvision import models
from rest_framework import serializers
from .models import Review,IncidentReport, IncidentImage
from django.conf import settings

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
vgg_model_path = os.path.join(settings.BASE_DIR, 'feedback', 'vgg16_custom_binary.pth')
class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user', 'review_type', 'description', 'rating', 'created_at']
        read_only_fields = ['user', 'created_at']
    def get_user(self, obj):
        return obj.user.username


class IncidentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncidentImage
        fields = ['image']


# Prediction utilities
label_map = {0: "Traffic", 1: "Harassment/Accident"}

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

def predict_image_from_file(model, file):
    image = Image.open(file).convert("RGB")
    input_tensor = transform(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        output = model(input_tensor)
        _, predicted = torch.max(output, 1)

    return predicted.item()

def load_trained_model(model_path):
    model = models.vgg16(pretrained=False)  # pretrained=False because weights are loaded manually

    # Your custom classifier with 6 FC layers
    model.classifier = nn.Sequential(
        nn.Linear(25088, 4096),
        nn.ReLU(),
        nn.Dropout(0.5),
        nn.Linear(4096, 2048),
        nn.ReLU(),
        nn.Dropout(0.4),
        nn.Linear(2048, 1024),
        nn.ReLU(),
        nn.Dropout(0.4),
        nn.Linear(1024, 512),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(512, 128),
        nn.ReLU(),
        nn.Dropout(0.2),
        nn.Linear(128, 2)
    )

    model.load_state_dict(torch.load(model_path, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    return model
class IncidentReportSerializer(serializers.ModelSerializer):
    images = IncidentImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=True
    )

    class Meta:
        model = IncidentReport
        fields = ['id', 'incident_type', 'location', 'description', 'created_at', 'images', 'uploaded_images']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        report = IncidentReport.objects.create(**validated_data)

        model_path = vgg_model_path
        model = load_trained_model(model_path)
        model.eval()

        for image_file in uploaded_images:
            class_id = predict_image_from_file(model, image_file)
            print(class_id)
            if class_id == 1:
                IncidentImage.objects.create(report=report, image=image_file)
            else:
                raise serializers.ValidationError({
                    'uploaded_images': 'One or more images are not classified as Harassment/Accident. Please upload valid images.'
                })

        return report

