from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.urls import reverse
from .models import TeaComment, CommentLike

# 论坛评论相关视图

@login_required
@require_POST
def post_tea_comment(request):
    """处理发表评论"""
    content = request.POST.get('comment_content', '')
    page_type = request.POST.get('page_type', 'encyclopedia')
    tea_type = request.POST.get('tea_type', None)
    parent_id = request.POST.get('parent_id', None)
    
    if not content:
        return JsonResponse({'status': 'error', 'message': '评论内容不能为空'})
    
    # 创建新评论
    comment = TeaComment(
        user=request.user,
        content=content,
        page_type=page_type,
        tea_type=tea_type
    )
    
    # 如果是回复评论
    if parent_id:
        try:
            parent_comment = TeaComment.objects.get(id=parent_id)
            comment.parent = parent_comment
        except TeaComment.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': '父评论不存在'})
    
    comment.save()
    
    # 根据页面类型重定向到不同页面
    if tea_type:
        return redirect(reverse('tea_detail', args=[tea_type]))
    else:
        return redirect(reverse('wantea_encyclopedia'))

@login_required
@require_POST
def like_comment(request):
    """处理评论点赞"""
    comment_id = request.POST.get('comment_id')
    if not comment_id:
        return JsonResponse({'status': 'error', 'message': '参数错误'})
    
    try:
        comment = TeaComment.objects.get(id=comment_id)
        
        # 检查用户是否已经点赞
        like, created = CommentLike.objects.get_or_create(
            user=request.user,
            comment=comment
        )
        
        # 如果已存在点赞，则取消点赞
        if not created:
            like.delete()
            is_liked = False
            likes_count = comment.likes.count()
        else:
            is_liked = True
            likes_count = comment.likes.count()
        
        return JsonResponse({
            'status': 'success',
            'is_liked': is_liked,
            'likes_count': likes_count
        })
    except TeaComment.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': '评论不存在'})

def get_comment_data(request, comment):
    """获取评论数据，包括是否点赞状态"""
    is_liked = False
    if request.user.is_authenticated:
        is_liked = CommentLike.objects.filter(user=request.user, comment=comment).exists()
    
    data = {
        'id': comment.id,
        'user': {
            'username': comment.user.username,
            'avatar_url': comment.user.profile.avatar_url if hasattr(comment.user, 'profile') else None
        },
        'content': comment.content,
        'created_at': comment.created_at.strftime('%Y-%m-%d'),
        'likes_count': comment.likes.count(),
        'is_liked_by_user': is_liked,
        'replies': []
    }
    
    # 添加回复数据
    for reply in comment.replies.filter(is_visible=True):
        reply_is_liked = False
        if request.user.is_authenticated:
            reply_is_liked = CommentLike.objects.filter(user=request.user, comment=reply).exists()
        
        reply_data = {
            'id': reply.id,
            'user': {
                'username': reply.user.username,
                'avatar_url': reply.user.profile.avatar_url if hasattr(reply.user, 'profile') else None
            },
            'content': reply.content,
            'created_at': reply.created_at.strftime('%Y-%m-%d'),
            'likes_count': reply.likes.count(),
            'is_liked_by_user': reply_is_liked
        }
        data['replies'].append(reply_data)
    
    return data

def wantea_encyclopedia(request):
    """茶百科页面视图"""
    # 获取评论列表
    comments = TeaComment.objects.filter(page_type='encyclopedia', parent=None, is_visible=True)
    
    # 准备评论数据，包括点赞状态
    tea_comments = []
    for comment in comments:
        tea_comments.append(get_comment_data(request, comment))
    
    context = {
        'tea_comments': tea_comments,
    }
    
    return render(request, 'teaweb/wantea_encyclopedia.html', context) 