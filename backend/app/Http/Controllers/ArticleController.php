<?php
namespace App\Http\Controllers;

use App\Services\ArticleService;
use App\Http\Requests\ArticleFilterRequest;
use Illuminate\Http\JsonResponse;
use Exception;
use App\Models\Article;

class ArticleController extends Controller
{
    private $articleService;

    public function __construct(ArticleService $articleService)
    {
        $this->articleService = $articleService;
    }

    public function index(ArticleFilterRequest $request): JsonResponse
    {
        try {
            $articles = $this->articleService->getFilteredArticles($request->validated());
            return response()->json($articles);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getCategories(): JsonResponse
    {
        try {
            $categories = $this->articleService->getCategories();
            return response()->json(['categories' => $categories]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getSources()
    {
        $sources = $this->articleService->getSources();
        return response()->json(['sources' => $sources]);
    }

    public function getAuthors()
    {
        $authors = $this->articleService->getAuthors();
        return response()->json(['authors' => $authors]);
    }

    public function show($id)
    {
        $article = Article::findOrFail($id);
        
        // Get recommended articles based on category
        $recommended = Article::where('category', $article->category)
            ->where('id', '!=', $article->id)
            ->limit(3)
            ->get();
        
        return response()->json([
            'article' => $article,
            'recommended' => $recommended
        ]);
    }
} 