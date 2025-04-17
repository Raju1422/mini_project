import os, json, pickle, math
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

# Load model and risk data once
scaler_kmeans_path = os.path.join(settings.BASE_DIR, 'core', 'scaler_kmeans.pkl')
cluster_json_path = os.path.join(settings.BASE_DIR, 'core', 'cluster.json')

with open(scaler_kmeans_path, 'rb') as file:
    loaded_objects = pickle.load(file)

with open(cluster_json_path, 'r') as file:
    risk_data = json.load(file)

scaler = loaded_objects['scaler']
kmeans = loaded_objects['kmeans']

# Risk scoring system
RISK_SCORES = {
    "Safe": 1,
    "Low Risk": 2,
    "Moderate Risk": 3,
    "High Risk": 4
}

# Risk + Length weight
RISK_WEIGHT = 0.7
LENGTH_WEIGHT = 0.3


def find_risk_level(cluster, risk_data):
    for level, clusters in risk_data.items():
        if cluster in clusters:
            return level
    return "Unknown"

def haversine(coord1, coord2):
    """Calculate distance between two lat/lng pairs in km."""
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    R = 6371  # Radius of earth in km

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat/2)**2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(dlon/2)**2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def calculate_route_length(route):
    return sum(haversine(route[i], route[i+1]) for i in range(len(route) - 1))

def calculate_route_risk(route, age=25):
    df = pd.DataFrame({
        "Vict Age": [age] * len(route),
        "LAT": [lat for lat, lng in route],
        "LON": [lng for lat, lng in route],
    })

    scaled = scaler.transform(df)
    clusters = kmeans.predict(scaled)
    risk_levels = [find_risk_level(c, risk_data) for c in clusters]
    risk_scores = [RISK_SCORES[r] for r in risk_levels]
    avg_score = sum(risk_scores) / len(risk_scores)
    return avg_score, risk_levels


class AnalyzeRoutesView(APIView):
    def post(self, request):
        routes = request.data.get("routes", [])
        if not routes:
            return Response({"error": "No routes provided"}, status=status.HTTP_400_BAD_REQUEST)

        summaries = []

        for idx, route in enumerate(routes):
            route = [(lat, lng) for lat, lng in route]
            risk_score, risk_levels = calculate_route_risk(route)
            length_km = calculate_route_length(route)
            composite_score = (RISK_WEIGHT * risk_score) + (LENGTH_WEIGHT * length_km)

            summaries.append({
                "route_index": idx,
                "average_risk_score": round(risk_score, 3),
                "route_length_km": round(length_km, 3),
                "composite_score": round(composite_score, 3),
                "risk_levels": risk_levels,
            })

        best_route = min(summaries, key=lambda r: r["composite_score"])

        return Response({
            "best_route_index": best_route["route_index"],
            "best_composite_score": best_route["composite_score"],
            "route_summaries": summaries
        })
