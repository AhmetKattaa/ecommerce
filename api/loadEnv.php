<?php
function loadEnv($path) {
    if (!file_exists($path)) {
        throw new Exception('.env dosyası bulunamadı: ' . $path);
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        
        if (!isset($_ENV[$key])) {
            $_ENV[$key] = $value;
        }
    }
}
