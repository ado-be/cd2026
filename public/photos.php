<?php

$dir = __DIR__ . '/photos';

$files = glob($dir . '/*', GLOB_BRACE);

$photos = [];

foreach ($files as $file) {

    if (is_file($file)) {

        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

        if (in_array($ext, ['jpg','jpeg','png','webp','bmp'])) {

            $photos[] = [
                'src' => 'photos/' . basename($file),
                'title' => pathinfo($file, PATHINFO_FILENAME)
            ];
        }
    }
}

header('Content-Type: application/json');
echo json_encode($photos, JSON_UNESCAPED_UNICODE);