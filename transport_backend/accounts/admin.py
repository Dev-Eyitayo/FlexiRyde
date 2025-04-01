from django.contrib import admin
from django.conf import settings
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

admin.site.site_header = "Transport Booking Admin"
admin.site.site_title = "Transport System"
admin.site.index_title = "Welcome to the Control Center"


class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'username', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('nin', 'role')}),
    )
    search_fields = ('email', 'username', 'nin')
    ordering = ('email',)

admin.site.register(User, CustomUserAdmin)
