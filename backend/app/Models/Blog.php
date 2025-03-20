<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class Blog extends Model
{
    use HasFactory, Sluggable;

    protected $fillable = [
        "title",
        "slug",
        "content",
        "excerpt",
        "user_id",
        "category_id",
        "image",
        "is_published",
        "likes",
        "views",
        "comments",
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title'
            ]
        ];
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(BlogCategory::class);
    }

    public function likedByUsers()
    {
        return $this->belongsToMany(User::class, 'blog_user_likes')->withTimestamps();
    }

    public function blog_comments()
    {
        return $this->hasMany(BlogComment::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'blog_tags');
    }
}
