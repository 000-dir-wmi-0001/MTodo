from rest_framework import serializers
from todo.models import Todo

class TodoSerializer(serializers.ModelSerializer):
    created_at = serializers.ReadOnlyField()
    completed = serializers.ReadOnlyField()

    class Meta:
        model = Todo
        fields = ['id', 'title', 'memo', 'created_at', 'completed']

    def validate_title(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value

    def validate_memo(self, value):
        if len(value) > 500:
            raise serializers.ValidationError("Memo cannot exceed 500 characters.")
        return value



class TodoToggleCompleteSerializer(serializers.ModelSerializer):
    completed = serializers.BooleanField(read_only=True)

    class Meta:
        model = Todo
        fields = ['id', 'completed']
        read_only_fields = ['title', 'memo', 'created_at']

