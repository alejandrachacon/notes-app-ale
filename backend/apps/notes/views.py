from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.decorators import action
from .models import Note
from .serializers import NoteSerializer, CATEGORY_COLORS
from .permissions import IsNoteOwner
import traceback


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        try:
            if self.request.user.is_authenticated:
                return Note.objects.filter(user=self.request.user)
            return Note.objects.none()
        except Exception as e:
            print(f"ERROR in get_queryset: {e}")
            traceback.print_exc()
            raise
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def categories(self, request):
        """Return available categories with their colors"""
        categories = [
            {'name': name, 'color': color}
            for name, color in CATEGORY_COLORS.items()
        ]
        return Response(categories)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
