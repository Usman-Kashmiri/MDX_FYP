<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogTag extends Model
{
    use HasFactory;

    protected $table = "blog_tags";

    protected $fillable = [
        'blog_id',
        'tag_id',
    ];

    public function blogs()
    {
        return $this->belongsTo(Blog::class, 'blog_id');
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class, 'tag_id');
    }
}
