<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogCommentReply extends Model
{
    use HasFactory;

    protected $table = "blog_comment_replies";

    protected $fillable = [
        'comment_id', 'user_id', 'content'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comment()
    {
        return $this->belongsTo(BlogComment::class, 'comment_id');
    }
}
