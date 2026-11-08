from django.contrib import admin
from .models import UserProfile, UserFavoriteTea

# Register your models here.
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'nickname', 'location', 'birth_date', 'created_at')
    search_fields = ('user__username', 'nickname', 'location')
    list_filter = ('privacy_level', 'receive_newsletter')

@admin.register(UserFavoriteTea)
class UserFavoriteTeaAdmin(admin.ModelAdmin):
    list_display = ('user', 'tea_id', 'added_at')
    search_fields = ('user__username', 'tea_id')
    list_filter = ('added_at',)
