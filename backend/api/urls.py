from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    # Authentication Endpoints
    path('signup/', views.SignupAPIView.as_view(), name='signup'),
    path('login/', obtain_auth_token, name='login'),  # Using DRF's obtain_auth_token for login
    path('token/', obtain_auth_token),  # Ensure this is present

    # Todo Endpoints
    path('todos/', views.TodoListCreate.as_view(), name='todo-list-create'),
    path('todos/<int:pk>/', views.TodoRetrieveUpdateDestroy.as_view(), name='todo-detail'),
    path('todos/<int:pk>/complete/', views.TodoToggleComplete.as_view(), name='todo-toggle-complete'),
]