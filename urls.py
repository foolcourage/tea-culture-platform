from django.urls import path
from . import views

urlpatterns = [
    # 已有的URL配置
    path('wantea/encyclopedia/', views.wantea_encyclopedia, name='wantea_encyclopedia'),
    path('wantea/detail/<str:tea_type>/', views.tea_detail, name='tea_detail'),
    
    # 评论相关URL
    path('comments/post/', views.post_tea_comment, name='post_tea_comment'),
    path('comments/like/', views.like_comment, name='like_comment'),
] 