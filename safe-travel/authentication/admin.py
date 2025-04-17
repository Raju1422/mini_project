from django.contrib import admin
from authentication.models import CustomUser


class CustomUserAdmin(admin.ModelAdmin):
    list_display =('id','username','email','age','phone_number')

admin.site.register(CustomUser,CustomUserAdmin)