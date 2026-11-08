from django.db import models
from django.contrib.auth.models import User

class TeaComment(models.Model):
    """茶叶评论模型"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tea_comments', verbose_name='用户')
    content = models.TextField(verbose_name='评论内容')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies', verbose_name='父评论')
    page_type = models.CharField(max_length=50, default='encyclopedia', verbose_name='页面类型')
    tea_type = models.CharField(max_length=50, null=True, blank=True, verbose_name='茶类型')
    is_visible = models.BooleanField(default=True, verbose_name='是否可见')

    class Meta:
        verbose_name = '茶叶评论'
        verbose_name_plural = '茶叶评论'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.content[:30]}"

class CommentLike(models.Model):
    """评论点赞模型"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comment_likes', verbose_name='用户')
    comment = models.ForeignKey(TeaComment, on_delete=models.CASCADE, related_name='likes', verbose_name='评论')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class Meta:
        verbose_name = '评论点赞'
        verbose_name_plural = '评论点赞'
        unique_together = ('user', 'comment')

    def __str__(self):
        return f"{self.user.username} likes {self.comment.id}" 