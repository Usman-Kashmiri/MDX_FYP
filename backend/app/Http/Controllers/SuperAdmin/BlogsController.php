<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use App\Http\Resources\CommentResource;
use App\Models\Blog;
use App\Models\BlogComment;
use App\Models\BlogCommentReply;
use App\Models\BlogUserLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BlogsController extends Controller
{
    public function index(Request $request)
    {
        $blogs = Blog::with('category', 'author', 'tags');

        if (isset($request->category_id)) {
            $blogs = $blogs->where('category_id', $request->category_id);
        }

        if (isset($request->tags)) {
            $tags = $request->tags;

            $blogs = $blogs->whereHas('tags', function ($query) use ($tags) {
                $query->whereIn('tag_id', $tags);
            });
        }

        $popularBlogs = $blogs->orderBy('likes', 'desc')->get();
        $recentBlogs = $blogs->orderBy('created_at', 'desc')->limit(3)->get();

        if (count($popularBlogs) > 0) {
            $popularBlogs = BlogResource::collection($popularBlogs);
            $recentBlogs = BlogResource::collection($recentBlogs);

            return response()->json([
                "res" => "success",
                "message" => "Blogs Found Successfully",
                "data" => [
                    "blogs" => $popularBlogs,
                    "recent_blogs" => $recentBlogs,
                ]
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Blogs Not Found",
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'title' => 'required|string',
                'content' => 'required',
                'excerpt' => 'nullable|string',
                'user_id' => 'required|exists:users,id',
                'category_id' => 'required|exists:blog_categories,id',
                "thumbnail" => 'required|image|mimes:jpeg,png,gif,jpg|max:2048',
                'is_published' => 'required|boolean',
                'tags' => 'array',
                'tags.*' => 'exists:tags,id',
            ]);
            if ($validator->fails()) {
                return response()->json(["res" => "success", 'message' => $validator->errors()->first()]);
            } else {

                $thumbnail = self::handleFileUpload($request, 'thumbnail', null, 'uploads/blogs/');

                $blog = Blog::create([
                    'title' => $request->title,
                    'content' => json_encode($request->content),
                    'excerpt' => $request->excerpt,
                    'user_id' => $request->user_id,
                    'category_id' => $request->category_id,
                    "image" => $thumbnail ?? $request->thumbnail,
                    'is_published' => $request->is_published,
                ]);

                if ($request->has('tags')) {
                    $blog->tags()->attach($request->input('tags'));
                }

                if (!empty($blog)) {
                    return response()->json([
                        "res" => "success",
                        "message" => "Blog Successfully Added",
                    ]);
                } else {
                    return response()->json([
                        "res" => "error",
                        "message" => "Couldn't Add Blog",
                    ]);
                }
            }
        } catch (\Exception $e) {
            return response()->json([
                "res" => "error",
                "message" => "Couldn't Create Blog", 'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $blog = Blog::with('category', 'author', 'tags')->where('slug', $slug)->first();

        if (!empty($blog)) {

            $user = auth()?->user();
            $isBlogLiked = false;

            if ($user?->role?->name !== "SuperAdmin" || $user?->role?->name !== "Admin") {
                $blog->increment('views');
            }

            if ($user) {
                $isBlogLiked = BlogUserLike::where(['user_id' => $user->id, 'blog_id' => $blog->id])->exists();
            }

            $similarBlogs = Blog::with('category', 'author', 'tags')
                ->whereHas('tags', function ($query) use ($blog) {
                    $query->whereIn('tags.id', $blog->tags->pluck('id'));
                })
                ->orWhere('category_id', $blog->category_id)
                ->where('id', '<>', $blog->id)
                ->limit(3)
                ->get();

            $blog = new BlogResource($blog);
            $similarBlogs = BlogResource::collection($similarBlogs);

            return response()->json([
                "res" => "success",
                "message" => "Blog Found Successfully",
                "data" => [
                    "is_blog_liked" => $isBlogLiked,
                    "blog" => $blog,
                    "related_blogs" => $similarBlogs,
                ],
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Couldn't Find Blog",
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {

            $validator = Validator::make($request->all(), [
                'title' => 'required|string',
                'content' => 'required',
                'excerpt' => 'nullable|string',
                'user_id' => 'required|exists:users,id',
                'category_id' => 'required|exists:blog_categories,id',
                'is_published' => 'required|boolean',
                'tags' => 'array',
                'tags.*' => 'exists:tags,id',
            ]);

            if (isset($request->thumbnail)) {
                $validateThumbnail = Validator::make($request->all(), [
                    "thumbnail" => 'image|mimes:jpeg,png,gif,jpg|max:2048',
                ]);

                if ($validateThumbnail->fails()) {
                    return response()->json(["res" => "success", 'message' => $validator->errors()->first()]);
                }
            }

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            $blog = Blog::find($id);

            if (!$blog) {
                // ? Handle the case where the blog with the given $id is not found
                return response()->json(['error' => 'Blog not found'], 404);
            }

            $thumbnail = self::handleFileUpload($request, 'thumbnail', $blog, 'uploads/blogs');

            $blog->title = $request->title;
            $blog->content = json_encode($request->content);
            $blog->excerpt = $request->excerpt;
            $blog->user_id = $request->user_id;
            $blog->category_id = $request->category_id;
            $blog->image = $thumbnail ?? $blog->image;
            $blog->is_published = $request->is_published;

            if ($request->has('tags')) {
                $blog->tags()->sync($request->input('tags'));
            }

            $isUpdated = $blog->save();

            if ($isUpdated) {
                return response()->json([
                    "res" => "success",
                    "message" => "Blog Updated Succcessfully",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't Update Blog",
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                "res" => "error",
                "message" => "Couldn't Update Blog", 'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $blog = Blog::destroy($id);

        if ($blog) {
            return response()->json([
                "res" => "success",
                "message" => "Blog Deleted Successfully",
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Couldn't Delete Blog",
            ]);
        }
    }

    public function blog_comments($id)
    {

        $comments = BlogComment::with('replies')->where('blog_id', $id)->get();

        if (count($comments) > 0) {

            $comments = CommentResource::collection($comments);

            return response()->json([
                'res' => 'success',
                'message' => 'Comments retrieved successfully',
                'data' => $comments,
            ]);
        } else {
            return response()->json([
                'res' => 'success',
                'message' => 'Comments Not Found',
            ]);
        }
    }

    public function like_blog($id)
    {
        $user = auth()->user();
        $blog = Blog::find($id);

        $existingLike = BlogUserLike::where([
            'user_id' => $user->id,
            'blog_id' => $blog->id,
        ])->first();

        if (!$existingLike) {
            BlogUserLike::create([
                'user_id' => $user->id,
                'blog_id' => $blog->id,
            ]);

            $blog->increment('likes');

            return response()->json([
                'res' => 'success',
                'message' => 'Blog liked successfully',
            ], 200);
        } else if ($existingLike) {
            $isLikeRemoved = $existingLike->delete();

            if ($isLikeRemoved) {

                $blog->decrement('likes', 1);

                return response()->json([
                    'res' => 'success',
                    'message' => 'Like has been removed',
                ], 200);
            }
        }
    }

    public function comment_on_blog(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        $user = auth()->user();
        $blog = Blog::find($id);

        $comment = BlogComment::create([
            'user_id' => $user->id,
            'blog_id' => $blog->id,
            'content' => $request->input('content'),
        ]);

        if (!empty($comment)) {

            $blog->increment('comments');

            return response()->json([
                'res' => 'success',
                'message' => 'Comment added successfully',
                'data' => $comment,
            ]);
        }
    }

    public function reply_on_comment(Request $request, $commentId)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        $user = auth()->user();
        $comment = BlogComment::find($commentId);

        if (!$comment) {
            return response()->json([
                "res" => "error",
                'message' => 'Comment not found'
            ], 404);
        }

        $reply = BlogCommentReply::create([
            'comment_id' => $comment->id,
            'content' => $request->content,
            'user_id' => $user->id,
        ]);

        if ($reply) {
            return response()->json([
                "res" => "success",
                'message' => 'Reply added successfully'
            ], 201);
        } else {
            return response()->json([
                "res" => "error",
                'message' => 'Failed to add reply'
            ], 500);
        }
    }

    public function edit_comment(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        $user = auth()->user();
        $comment = BlogComment::where(['id' => $id, 'user_id' => $user->id])->first();

        if ($comment) {
            $comment->content = $request->content;
            $isUpdated = $comment->save();

            if ($isUpdated) {
                return response()->json([
                    "res" => "success",
                    'message' => "Comment updated successfully"
                ], 201);
            } else {
                return response()->json([
                    "res" => "error",
                    'message' => "Couldn't update comment"
                ], 500);
            }
        } else {
            return response()->json([
                "res" => "error",
                'message' => "Couldn't find your comment"
            ], 500);
        }
    }

    public function delete_comment($id)
    {
        $user = auth()->user();
        $comment = BlogComment::where(['id' => $id, 'user_id' => $user->id])->first();

        if ($comment) {
            $isDeleted = $comment->delete();

            if ($isDeleted) {
                return response()->json([
                    "res" => "success",
                    'message' => "Comment deleted successfully"
                ], 201);
            } else {
                return response()->json([
                    "res" => "error",
                    'message' => "Couldn't delete comment"
                ], 500);
            }
        } else {
            return response()->json([
                "res" => "error",
                'message' => "Couldn't find your comment"
            ], 500);
        }
    }

    public function edit_reply(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        $user = auth()->user();
        $comment = BlogCommentReply::where(['id' => $id, 'user_id' => $user->id])->first();

        if ($comment) {
            $comment->content = $request->content;
            $isUpdated = $comment->save();

            if ($isUpdated) {
                return response()->json([
                    "res" => "success",
                    'message' => "Reply updated successfully"
                ], 201);
            } else {
                return response()->json([
                    "res" => "error",
                    'message' => "Couldn't update reply"
                ], 500);
            }
        } else {
            return response()->json([
                "res" => "error",
                'message' => "Couldn't find your reply"
            ], 500);
        }
    }

    public function delete_reply($id)
    {
        $user = auth()->user();
        $comment = BlogCommentReply::where(['id' => $id, 'user_id' => $user->id])->first();

        if ($comment) {
            $isDeleted = $comment->delete();

            if ($isDeleted) {
                return response()->json([
                    "res" => "success",
                    'message' => "Reply deleted successfully"
                ], 201);
            } else {
                return response()->json([
                    "res" => "error",
                    'message' => "Couldn't delete reply"
                ], 500);
            }
        } else {
            return response()->json([
                "res" => "error",
                'message' => "Couldn't find your reply"
            ], 500);
        }
    }
}
