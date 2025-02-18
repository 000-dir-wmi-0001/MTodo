from django.db import models
from django.contrib.auth.models import User

class Todo(models.Model):
  title= models.CharField(max_length=100)
  memo= models.TextField(blank=True)

  created_at= models.DateTimeField(auto_now_add=True)
  completed = models.BooleanField(default=False)


  user= models.ForeignKey(User, on_delete=models.CASCADE)

  def __self__(self):
    return self.title