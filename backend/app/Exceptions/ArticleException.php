<?php

namespace App\Exceptions;

use Exception;

class ArticleException extends Exception
{
    public static function failedToRetrieve(): self
    {
        return new self('Failed to retrieve articles');
    }

    public static function failedToFilter(): self
    {
        return new self('Failed to apply filters to articles');
    }
} 