from rest_framework import generics, permissions, status
from .serializers import TodoSerializer, TodoToggleCompleteSerializer
from todo.models import Todo
from django.db import IntegrityError
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

# List and Create Todos
class TodoListCreate(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return todos that belong to the logged-in user
        user = self.request.user
        return Todo.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        # Assign the logged-in user to the new todo
        todo = serializer.save(user=self.request.user)
        # Send back a success message along with the newly created todo
        return JsonResponse({
            'message': 'Todo created successfully!',
            'todo': TodoSerializer(todo).data
        }, status=status.HTTP_201_CREATED)

# Retrieve, Update, or Delete a Todo
class TodoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return todos that belong to the logged-in user
        user = self.request.user
        return Todo.objects.filter(user=user)

    def get_object(self):
        try:
            todo = super().get_object()
            if todo.user != self.request.user:
                raise NotFound('Todo not found')
            return todo
        except Todo.DoesNotExist:
            raise NotFound('Todo not found')

    def perform_update(self, serializer):
        # Perform the update and return the updated todo
        todo = serializer.save()
        return JsonResponse({
            'message': 'Todo updated successfully!',
            'todo': TodoSerializer(todo).data
        }, status=status.HTTP_200_OK)

    def perform_destroy(self, instance):
        # Perform the delete and send a success message
        instance.delete()
        return JsonResponse({
            'message': 'Todo deleted successfully!',
        }, status=status.HTTP_204_NO_CONTENT)

# Toggle Todo Completion Status
class TodoToggleComplete(generics.UpdateAPIView):
    serializer_class = TodoToggleCompleteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return todos that belong to the logged-in user
        user = self.request.user
        return Todo.objects.filter(user=user)

    def perform_update(self, serializer):
        todo = serializer.instance
        todo.completed = not todo.completed
        todo.save()
        return JsonResponse({
            'message': 'Todo completion status updated successfully!',
            'todo': TodoSerializer(todo).data
        }, status=status.HTTP_200_OK)

# Signup API View
class SignupAPIView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create a new user and generate a token
            user = User.objects.create_user(username=username, password=password)
            token = Token.objects.create(user=user)
            return JsonResponse({'token': str(token)}, status=status.HTTP_201_CREATED)

        except IntegrityError:
            return JsonResponse(
                {'error': 'Username is already taken. Please choose another username.'},
                status=status.HTTP_400_BAD_REQUEST
            )

# Login API View
class LoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is None:
            return JsonResponse({'error': 'Invalid username or password.'}, status=status.HTTP_400_BAD_REQUEST)

        token, created = Token.objects.get_or_create(user=user)

        return JsonResponse({'token': str(token)}, status=status.HTTP_200_OK)
