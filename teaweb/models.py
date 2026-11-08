from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    """用户个人资料模型，扩展Django默认用户模型"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    nickname = models.CharField("昵称", max_length=50, blank=True)
    avatar = models.ImageField("头像", upload_to='avatars/', blank=True, null=True)
    bio = models.TextField("个人简介", max_length=500, blank=True)
    location = models.CharField("所在地", max_length=100, blank=True)
    birth_date = models.DateField("生日", null=True, blank=True)
    favorite_tea = models.CharField("喜爱的茶", max_length=100, blank=True)
    
    # 用户偏好
    receive_newsletter = models.BooleanField("接收资讯", default=True)
    privacy_level = models.CharField("隐私设置", max_length=20, 
                                    choices=[('public', '公开'), ('private', '私密')],
                                    default='public')
    
    # 记录信息
    created_at = models.DateTimeField("创建时间", auto_now_add=True)
    updated_at = models.DateTimeField("更新时间", auto_now=True)
    
    class Meta:
        verbose_name = "用户资料"
        verbose_name_plural = "用户资料"
    
    def __str__(self):
        return f"{self.user.username}的个人资料"
    
    @property
    def avatar_url(self):
        """返回用户头像URL，如果没有则返回默认头像"""
        if self.avatar and hasattr(self.avatar, 'url'):
            return self.avatar.url
        return '/static/images/default-avatar.jpg'

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """当创建User实例时自动创建关联的UserProfile"""
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """当保存User实例时自动保存关联的UserProfile"""
    instance.profile.save()

class UserFavoriteTea(models.Model):
    """用户收藏的茶叶"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    tea_id = models.CharField("茶叶ID", max_length=50)
    added_at = models.DateTimeField("添加时间", auto_now_add=True)
    
    class Meta:
        verbose_name = "收藏茶叶"
        verbose_name_plural = "收藏茶叶"
        # 确保用户不会重复收藏同一种茶叶
        unique_together = ['user', 'tea_id']
    
    def __str__(self):
        return f"{self.user.username}收藏的{self.tea_id}"

# 茶叶评论模型
class TeaComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tea_comments', verbose_name='用户')
    content = models.TextField(verbose_name='评论内容')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies', verbose_name='父评论')
    page_type = models.CharField(max_length=50, default='encyclopedia', verbose_name='页面类型') 
    tea_type = models.CharField(max_length=50, null=True, blank=True, verbose_name='茶叶类型')
    is_visible = models.BooleanField(default=True, verbose_name='是否可见')
    
    class Meta:
        verbose_name = '茶叶评论'
        verbose_name_plural = '茶叶评论'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.user.username}的评论: {self.content[:20]}...'

# 评论点赞模型
class CommentLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comment_likes', verbose_name='用户')
    comment = models.ForeignKey(TeaComment, on_delete=models.CASCADE, related_name='likes', verbose_name='评论')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    
    class Meta:
        verbose_name = '评论点赞'
        verbose_name_plural = '评论点赞'
        unique_together = ['user', 'comment']
    
    def __str__(self):
        return f'{self.user.username} 点赞了 {self.comment.user.username}的评论'
