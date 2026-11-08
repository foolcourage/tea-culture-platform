"""
URL configuration for wantea project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.views import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('teaweb.urls')),
]

# 确保静态文件和媒体文件都能被正确服务
if settings.DEBUG:
    # 处理媒体文件
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # 处理静态文件，包括视频
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
