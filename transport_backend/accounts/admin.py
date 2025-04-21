# from django.contrib import admin
# from django.conf import settings
# from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# from .models import User

# admin.site.site_header = "FlexiRyde Admin"
# admin.site.site_title = "FlexiRyde"
# admin.site.index_title = "Welcome to the Control Center"


# class CustomUserAdmin(BaseUserAdmin):
#     model = User
#     list_display = ('email', 'role_display', 'is_active', 'is_staff')
#     list_filter = ('role', 'is_active', 'is_staff')
#     fieldsets = BaseUserAdmin.fieldsets + (
#         (None, {'fields': ('nin', 'role')}),
#     )
#     search_fields = ('email', 'nin', "first_name", "last_name")
#     ordering = ('email',)

#     def role_display(self, obj):
#         badge = {
#             'developer': '🛠️ Developer',
#             'park_admin': '🧭 Park Admin',
#             'passenger': '🧍 Passenger'
#         }
#         return badge.get(obj.role, obj.role)

#     role_display.short_description = 'Role'


# admin.site.register(User, CustomUserAdmin)


from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

admin.site.site_header = "FlexiRyde Admin"
admin.site.site_title = "FlexiRyde"
admin.site.index_title = "Welcome to the Control Center"

class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'role_display', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('email', 'nin', 'first_name', 'last_name')
    ordering = ('email',)

    # Fields to display when editing a user
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'nin', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Fields to display when adding a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'nin', 'role', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser'),
        }),
    )

    filter_horizontal = ('groups', 'user_permissions',)

    def role_display(self, obj):
        badge = {
            'admin': '🔧 Admin',
            'park_admin': '🧭 Park Admin',
            'passenger': '🧍 Passenger',
            # Remove 'developer' if not in model choices
        }
        return badge.get(obj.role, obj.role)

    role_display.short_description = 'Role'

admin.site.register(User, CustomUserAdmin)