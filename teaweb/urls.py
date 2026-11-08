from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('wanteasource/', views.wantea_source, name='wantea_source'),
    path('wanteaencyclopedia/', views.wantea_encyclopedia, name='wantea_encyclopedia'),
    path('wanteaceremony/', views.wantea_ceremony, name='wantea_ceremony'),
    path('personalcenter/', views.personal_center, name='personal_center'),
    path('tea/<str:tea_id>/', views.tea_detail, name='tea_detail'),
    
    # 用户认证相关URL
    path('login/', views.user_login, name='login'),
    path('register/', views.user_register, name='register'),
    path('logout/', views.user_logout, name='logout'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    
    # 茶叶收藏相关URL
    path('tea/<str:tea_id>/favorite/', views.toggle_favorite_tea, name='toggle_favorite_tea'),
    
    # 评论相关URL
    path('comments/post/', views.post_tea_comment, name='post_tea_comment'),
    path('comments/like/', views.like_comment, name='like_comment'),
    path('wantea-encyclopedia/like/<int:comment_id>/', views.like_comment, name='like_comment'),
    path('tea-video-gallery/', views.tea_video_gallery, name='tea_video_gallery'),
] 