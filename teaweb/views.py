from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import transaction
from .forms import CustomUserCreationForm, CustomAuthenticationForm, UserProfileForm
from .models import UserProfile, UserFavoriteTea, TeaComment, CommentLike
from django.views.decorators.http import require_POST

# Create your views here.

def home(request):
    """主页，默认重定向到皖茶源页面"""
    return wantea_source(request)

def wantea_source(request):
    """皖茶源页面，显示图片轮播"""
    return render(request, 'teaweb/wantea_source.html')

def wantea_encyclopedia(request):
    """皖茶百科页面"""
    # 获取评论列表
    comments = TeaComment.objects.filter(page_type='encyclopedia', parent=None, is_visible=True)
    
    # 准备评论数据，包括点赞状态
    tea_comments = []
    for comment in comments:
        is_liked = False
        if request.user.is_authenticated:
            is_liked = CommentLike.objects.filter(user=request.user, comment=comment).exists()
        
        comment_data = {
            'id': comment.id,
            'user': comment.user,
            'content': comment.content,
            'created_at': comment.created_at,
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
                'user': reply.user,
                'content': reply.content,
                'created_at': reply.created_at,
                'likes_count': reply.likes.count(),
                'is_liked_by_user': reply_is_liked
            }
            comment_data['replies'].append(reply_data)
        
        tea_comments.append(comment_data)
    
    context = {
        'tea_comments': tea_comments,
    }
    
    return render(request, 'teaweb/wantea_encyclopedia.html', context)

def wantea_ceremony(request):
    """皖韵茶道页面"""
    return render(request, 'teaweb/wantea_ceremony.html')

# 安徽茶叶数据
tea_data = {
    'huangshan': {
        'name': '黄山毛峰',
        'type': '绿茶',
        'region': '安徽省黄山市',
        'image_file': 'huangshan.jpg',
        'description': '黄山毛峰是中国十大名茶之一，产于安徽省黄山市，是历史名茶，距今已有200多年历史。它以"细、圆、紧、直、多白毫、香高持久、汤色清亮、滋味醇厚"的独特品质特点著称。',
        'origin_features': '黄山毛峰产于黄山风景区，海拔较高，昼夜温差大，云雾缭绕，土壤肥沃，有机质含量高，这些自然条件造就了黄山毛峰独特的品质。',
        'appearance': '外形细秀圆直，状似雀舌，白毫显露，色泽翠绿。',
        'aroma': '具有独特的兰花香和板栗香，香气高锐持久。',
        'taste': '滋味鲜爽醇厚，回甘持久。',
        'liquid_color': '汤色嫩绿明亮，清澈透明。',
        'brewing_guide': '冲泡黄山毛峰时，水温宜控制在80-85℃，投茶量约为3-5克，茶具宜选用玻璃杯或白瓷盖碗，以便观赏其冲泡过程和汤色。冲泡时间约为2-3分钟。',
        'history': '黄山毛峰创制于清代道光年间（约1875年），最初由当地茶农谢裕泰所创制。因产于黄山山区，且成品茶外形细扁挺直，顶端有白色毫毛，故得名"黄山毛峰"。'
    },
    'qimen': {
        'name': '祁门红茶',
        'type': '红茶',
        'region': '安徽省祁门县',
        'image_file': 'qimen.jpg',
        'description': '祁门红茶，又称祁红，中国历史名茶，是世界三大高香红茶之一，产于安徽省祁门县一带。具有"香高、味醇、形美、色艳"的特点，被誉为"红茶皇后"。',
        'origin_features': '祁门县地处黄山余脉，山高谷深，溪流纵横，气候温和湿润，土壤呈微酸性，富含有机质，非常适合茶树生长，为祁门红茶提供了优越的自然条件。',
        'appearance': '条索紧细匀整，乌润有光泽，锋苗秀丽。',
        'aroma': '具有独特的"祁门香"（又称"酒香"），香气馥郁持久。',
        'taste': '滋味醇厚甘鲜，回甘明显。',
        'liquid_color': '汤色红艳明亮，橙红透亮。',
        'brewing_guide': '冲泡祁门红茶时，水温宜用95-100℃沸水，投茶量约为3-5克，茶具推荐使用紫砂壶或白瓷盖碗。第一泡约30秒，后续每泡可适当延长时间。',
        'history': '祁门红茶创制于清朝光绪年间（1875年），由当地茶商胡元龙引进福建武夷山的制茶技术，结合本地材料创制而成。因原产于祁门县，故名"祁门红茶"。'
    },
    'taiping': {
        'name': '太平猴魁',
        'type': '绿茶',
        'region': '安徽省黄山市太平县',
        'image_file': 'taiping.jpg',
        'description': '太平猴魁是中国传统名茶，属于绿茶类，产于安徽省黄山市太平县。其特点是"两叶抱一芽"，扁平挺直，呈剑形，自然舒展，白毫显露，香气馥郁持久。',
        'origin_features': '太平猴魁主要产于黄山市太平县猴坑一带的高山云雾区域，海拔较高，气候凉爽，雨量充沛，昼夜温差大，常年云雾缭绕，茶树生长缓慢，有利于茶叶内含物质的积累。',
        'appearance': '外形扁平挺直如兰蕙，两叶抱一芽，中脉呈紫红色，叶缘微翘，毫毛显露。',
        'aroma': '清新持久，带有兰花香和板栗香。',
        'taste': '醇厚回甘，鲜爽生津。',
        'liquid_color': '汤色嫩绿明亮，清澈透明。',
        'brewing_guide': '冲泡太平猴魁时，水温控制在80-85℃，投茶量约为3克，茶具宜选用玻璃杯或白瓷盖碗。冲泡时间约为2分钟，可多次冲泡。',
        'history': '太平猴魁起源于清朝道光年间，相传是由当地猴坑村茶农从野生茶树变异而来。因产于太平县猴坑村，且外形挺拔俊秀如"魁首"，故名"太平猴魁"。'
    },
    'luian': {
        'name': '六安瓜片',
        'type': '绿茶',
        'region': '安徽省六安市',
        'image_file': 'luian.jpg',
        'description': '六安瓜片是中国传统名茶，属于绿茶类，产于安徽省六安市。其特点是只采单片嫩叶，不采芽头，制成后形似瓜子，无梗无芽，片片精巧，叶脉绿中隐红，十分独特。',
        'origin_features': '六安瓜片产于大别山区，这里土壤肥沃，雨量充沛，气候温和，山高林密，阳光充足但不炽热，非常适合茶树生长。',
        'appearance': '形似瓜子，片片精巧，无芽无梗，叶脉绿中隐红，色泽翠绿。',
        'aroma': '香气清高持久，带有特殊的兰花香。',
        'taste': '滋味鲜爽甘醇，回甘明显。',
        'liquid_color': '汤色嫩绿明亮，清澈透亮。',
        'brewing_guide': '冲泡六安瓜片时，水温宜控制在85℃左右，投茶量约为3克，宜选用玻璃杯或透明盖碗，可欣赏其在水中的舒展过程。冲泡时间约为2分钟。',
        'history': '六安瓜片有近400年历史，始于明末清初。因外形似瓜子片，且原产于六安府（今安徽省六安市），故名"六安瓜片"。它是中国唯一一种没有芽头的名茶，工艺独特。'
    },
    'tunxi': {
        'name': '屯溪绿茶',
        'type': '绿茶',
        'region': '安徽省黄山市屯溪区',
        'image_file': 'tunxi.jpg',
        'description': '屯溪绿茶是安徽省黄山地区的特色茶叶，产于黄山市屯溪区。它具有外形紧结匀整，色泽翠绿，香气清高持久，滋味鲜爽回甘等特点，是黄山地区的代表性茶品。',
        'origin_features': '屯溪区四周群山环抱，气候温和湿润，雨量充沛，土壤肥沃，这里的茶园多分布在海拔300-800米的山地，阳光适中，非常适合茶树生长。',
        'appearance': '条索紧结匀整，色泽翠绿鲜活。',
        'aroma': '清香高雅，带有花果香。',
        'taste': '鲜爽生津，回甘明显。',
        'liquid_color': '汤色黄绿清亮，清澈透明。',
        'brewing_guide': '冲泡屯溪绿茶时，水温宜控制在80-85℃，投茶量约为3-4克，茶具宜选用玻璃杯或白瓷盖碗。冲泡时间约为2-3分钟，可多次冲泡。',
        'history': '屯溪绿茶历史悠久，源于唐代，距今已有1000多年历史。屯溪是历史上著名的茶叶集散地，自古就有"茶在黄山，市在屯溪"的说法，曾是黄山茶叶的重要输出地。'
    },
    'jingting': {
        'name': '敬亭绿雪',
        'type': '绿茶',
        'region': '安徽省宣城市宣州区',
        'image_file': 'jingting.jpg',
        'description': '敬亭绿雪是安徽省宣城市的特色名茶，产于宣州区敬亭山一带。它以芽头肥壮、白毫显露、色泽嫩绿、香气清幽、滋味鲜爽等特点著称，被誉为"江南第一茗"。',
        'origin_features': '敬亭绿雪产于道教名山敬亭山，此地土壤肥沃、气候湿润，山上云雾弥漫，为茶树生长提供了得天独厚的自然环境。敬亭山早在唐代就因唐代诗人李白的《独坐敬亭山》诗而闻名。',
        'appearance': '外形微卷似雀舌，芽头肥壮，满披白毫，色泽嫩绿，光泽油润。',
        'aroma': '清香高雅，带有花果香，香气持久。',
        'taste': '滋味鲜爽甘醇，回甘明显，生津解渴。',
        'liquid_color': '汤色嫩绿明亮，清澈剔透，叶底嫩绿明亮。',
        'brewing_guide': '冲泡敬亭绿雪时，水温宜控制在80℃左右，投茶量约为3克，宜选用透明玻璃杯或白瓷盖碗。冲泡时间约为2分钟，可多次冲泡。',
        'history': '敬亭绿雪历史悠久，始于唐代。相传唐代大诗人李白游览敬亭山时，曾品尝当地茶叶并赞不绝口。敬亭绿雪因其外形似雪，产于敬亭山而得名，是安徽传统名茶之一。'
    }
}

def tea_detail(request, tea_id):
    """茶叶详情页面"""
    # 获取指定茶叶的信息
    tea_info = tea_data.get(tea_id, {})
    
    # 如果找不到指定茶叶，返回到百科页面
    if not tea_info:
        return wantea_encyclopedia(request)
    
    # 检查用户是否已收藏该茶叶
    is_favorite = False
    if request.user.is_authenticated:
        is_favorite = UserFavoriteTea.objects.filter(user=request.user, tea_id=tea_id).exists()
    
    # 视频文件名默认与茶叶ID相同
    video_filename = f"{tea_id}.mp4"
    
    context = {
        'tea_info': tea_info,
        'tea_id': tea_id,
        'is_favorite': is_favorite,
        'video_filename': video_filename
    }
    return render(request, 'teaweb/tea_detail.html', context)

def user_login(request):
    """用户登录视图"""
    if request.user.is_authenticated:
        return redirect('personal_center')
        
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'欢迎回来，{username}!')
                # 获取next参数，实现登录后跳转回原页面
                next_page = request.GET.get('next')
                if next_page:
                    return redirect(next_page)
                else:
                    return redirect('personal_center')
            else:
                messages.error(request, '用户名或密码不正确')
        else:
            messages.error(request, '登录失败，请检查表单信息')
    else:
        form = CustomAuthenticationForm()
    
    return render(request, 'teaweb/auth/login.html', {'form': form})

def user_register(request):
    """用户注册视图"""
    if request.user.is_authenticated:
        return redirect('personal_center')
        
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f'注册成功，欢迎 {user.username}!')
            return redirect('personal_center')
        else:
            messages.error(request, '注册失败，请检查表单信息')
    else:
        form = CustomUserCreationForm()
    
    return render(request, 'teaweb/auth/register.html', {'form': form})

def user_logout(request):
    """用户登出视图"""
    logout(request)
    messages.success(request, '您已成功退出登录')
    return redirect('home')

@login_required
def personal_center(request):
    """个人中心视图 - 需要登录才能访问"""
    user_profile = request.user.profile
    favorites = UserFavoriteTea.objects.filter(user=request.user)
    
    # 获取收藏的茶叶详情
    favorite_teas = []
    for fav in favorites:
        tea_info = tea_data.get(fav.tea_id)
        if tea_info:
            favorite_teas.append({
                'id': fav.tea_id,
                'name': tea_info.get('name'),
                'type': tea_info.get('type'),
                'image_file': tea_info.get('image_file'),
                'added_at': fav.added_at
            })
    
    context = {
        'profile': user_profile,
        'favorite_teas': favorite_teas
    }
    return render(request, 'teaweb/personal_center.html', context)

@login_required
def edit_profile(request):
    """编辑个人资料视图"""
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=request.user.profile)
        if form.is_valid():
            form.save()
            messages.success(request, '个人资料更新成功')
            return redirect('personal_center')
        else:
            messages.error(request, '更新失败，请检查表单信息')
    else:
        form = UserProfileForm(instance=request.user.profile)
    
    return render(request, 'teaweb/auth/edit_profile.html', {'form': form})

@login_required
def toggle_favorite_tea(request, tea_id):
    """添加或移除收藏的茶叶"""
    # 获取收藏状态
    favorite, created = UserFavoriteTea.objects.get_or_create(
        user=request.user,
        tea_id=tea_id
    )
    
    # 如果不是新创建的，则表示已收藏，需要移除
    if not created:
        favorite.delete()
        messages.success(request, f'已从收藏中移除该茶叶')
    else:
        messages.success(request, f'已成功收藏该茶叶')
    
    return redirect('tea_detail', tea_id=tea_id)

# 评论相关视图函数
@login_required
@require_POST
def post_tea_comment(request):
    """处理发表评论"""
    content = request.POST.get('comment_content', '')
    page_type = request.POST.get('page_type', 'encyclopedia')
    tea_type = request.POST.get('tea_type', None)
    parent_id = request.POST.get('parent_id', None)
    
    if not content:
        messages.error(request, '评论内容不能为空')
        if tea_type:
            return redirect('tea_detail', tea_id=tea_type)
        else:
            return redirect('wantea_encyclopedia')
    
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
            messages.error(request, '回复的评论不存在')
            if tea_type:
                return redirect('tea_detail', tea_id=tea_type)
            else:
                return redirect('wantea_encyclopedia')
    
    comment.save()
    messages.success(request, '评论发表成功')
    
    # 根据页面类型重定向到不同页面
    if tea_type:
        return redirect('tea_detail', tea_id=tea_type)
    else:
        return redirect('wantea_encyclopedia')

@login_required
def like_comment(request):
    """处理评论点赞"""
    if request.method != 'POST':
        return redirect('wantea_encyclopedia')
        
    comment_id = request.POST.get('comment_id')
    if not comment_id:
        messages.error(request, '参数错误')
        return redirect('wantea_encyclopedia')
    
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
            messages.success(request, '已取消点赞')
        else:
            messages.success(request, '点赞成功')
        
        # 确定返回的页面
        if comment.tea_type:
            return redirect('tea_detail', tea_id=comment.tea_type)
        else:
            return redirect('wantea_encyclopedia')
            
    except TeaComment.DoesNotExist:
        messages.error(request, '评论不存在')
        return redirect('wantea_encyclopedia')

def tea_video_gallery(request):
    """视频画廊页面视图"""
    return render(request, 'teaweb/tea_video_gallery.html')
