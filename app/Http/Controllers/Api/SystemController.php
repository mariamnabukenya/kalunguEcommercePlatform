<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{User, Product, Order, Category, Review};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Cache, Artisan, Storage};
use Illuminate\Support\Facades\Validator;

class SystemController extends Controller
{
    /**
     * Get system settings and configuration
     */
    public function settings()
    {
        $settings = [
            'system_info' => [
                'laravel_version' => app()->version(),
                'php_version' => PHP_VERSION,
                'database_connection' => config('database.default'),
                'cache_driver' => config('cache.default'),
                'queue_driver' => config('queue.default'),
                'mail_driver' => config('mail.default'),
            ],
            'application_settings' => [
                'app_name' => config('app.name'),
                'app_url' => config('app.url'),
                'app_env' => config('app.env'),
                'app_debug' => config('app.debug'),
                'timezone' => config('app.timezone'),
            ],
            'database_stats' => [
                'total_users' => User::count(),
                'total_products' => Product::count(),
                'total_orders' => Order::count(),
                'total_categories' => Category::count(),
                'total_reviews' => Review::count(),
            ],
            'storage_info' => [
                'disk_usage' => $this->getDiskUsage(),
                'cache_size' => $this->getCacheSize(),
            ]
        ];

        return response()->json($settings);
    }

    /**
     * Update system settings
     */
    public function updateSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'app_name' => 'sometimes|string|max:255',
            'app_url' => 'sometimes|url',
            'timezone' => 'sometimes|string|in:' . implode(',', timezone_identifiers_list()),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // In a real application, you'd update configuration files or database settings
        // For now, we'll just acknowledge the request
        return response()->json([
            'message' => 'Settings would be updated in production environment',
            'data' => $validator->validated()
        ]);
    }

    /**
     * Clear system cache
     */
    public function clearCache(Request $request)
    {
        $cacheTypes = $request->get('types', ['all']);

        try {
            foreach ($cacheTypes as $type) {
                switch ($type) {
                    case 'config':
                        Artisan::call('config:clear');
                        break;
                    case 'route':
                        Artisan::call('route:clear');
                        break;
                    case 'view':
                        Artisan::call('view:clear');
                        break;
                    case 'cache':
                        Artisan::call('cache:clear');
                        break;
                    case 'all':
                    default:
                        Artisan::call('optimize:clear');
                        break;
                }
            }

            return response()->json([
                'message' => 'Cache cleared successfully',
                'types' => $cacheTypes
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to clear cache',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get system health check
     */
    public function healthCheck()
    {
        $health = [
            'status' => 'healthy',
            'timestamp' => now(),
            'checks' => []
        ];

        // Database connection check
        try {
            DB::connection()->getPdo();
            $health['checks']['database'] = [
                'status' => 'healthy',
                'message' => 'Database connection successful'
            ];
        } catch (\Exception $e) {
            $health['status'] = 'unhealthy';
            $health['checks']['database'] = [
                'status' => 'unhealthy',
                'message' => 'Database connection failed: ' . $e->getMessage()
            ];
        }

        // Cache check
        try {
            Cache::put('health_check', 'test', 10);
            $cached = Cache::get('health_check');
            if ($cached === 'test') {
                $health['checks']['cache'] = [
                    'status' => 'healthy',
                    'message' => 'Cache is working'
                ];
            } else {
                throw new \Exception('Cache test failed');
            }
            Cache::forget('health_check');
        } catch (\Exception $e) {
            $health['status'] = 'unhealthy';
            $health['checks']['cache'] = [
                'status' => 'unhealthy',
                'message' => 'Cache failed: ' . $e->getMessage()
            ];
        }

        // Storage check
        try {
            Storage::put('health_check.txt', 'test');
            $content = Storage::get('health_check.txt');
            if ($content === 'test') {
                $health['checks']['storage'] = [
                    'status' => 'healthy',
                    'message' => 'Storage is working'
                ];
            } else {
                throw new \Exception('Storage test failed');
            }
            Storage::delete('health_check.txt');
        } catch (\Exception $e) {
            $health['status'] = 'unhealthy';
            $health['checks']['storage'] = [
                'status' => 'unhealthy',
                'message' => 'Storage failed: ' . $e->getMessage()
            ];
        }

        // Memory usage check
        $memoryUsage = memory_get_usage(true);
        $memoryLimit = $this->returnBytes(ini_get('memory_limit'));
        $memoryPercentage = ($memoryUsage / $memoryLimit) * 100;

        $health['checks']['memory'] = [
            'status' => $memoryPercentage < 90 ? 'healthy' : 'warning',
            'usage' => $this->formatBytes($memoryUsage),
            'limit' => $this->formatBytes($memoryLimit),
            'percentage' => round($memoryPercentage, 2) . '%'
        ];

        return response()->json($health);
    }

    /**
     * Get system logs
     */
    public function getLogs(Request $request)
    {
        $logType = $request->get('type', 'laravel');
        $lines = $request->get('lines', 100);

        try {
            $logPath = storage_path("logs/{$logType}.log");
            
            if (!file_exists($logPath)) {
                return response()->json([
                    'message' => 'Log file not found',
                    'logs' => []
                ]);
            }

            $logs = [];
            $file = new \SplFileObject($logPath, 'r');
            $file->seek(PHP_INT_MAX);
            $totalLines = $file->key();
            $startLine = max(0, $totalLines - $lines);
            
            $file->seek($startLine);
            while (!$file->eof()) {
                $line = trim($file->current());
                if (!empty($line)) {
                    $logs[] = $line;
                }
                $file->next();
            }

            return response()->json([
                'logs' => array_slice($logs, -$lines),
                'total_lines' => $totalLines,
                'showing_lines' => count($logs)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to read logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Backup database
     */
    public function backupDatabase()
    {
        try {
            $filename = 'backup_' . date('Y-m-d_H-i-s') . '.sql';
            
            // This is a simplified example - in production you'd use a proper backup tool
            Artisan::call('db:backup', ['--filename' => $filename]);
            
            return response()->json([
                'message' => 'Database backup initiated',
                'filename' => $filename
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Backup failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Run maintenance mode commands
     */
    public function maintenance(Request $request)
    {
        $action = $request->get('action'); // 'down' or 'up'

        try {
            if ($action === 'down') {
                Artisan::call('down', [
                    '--secret' => 'super-admin-secret',
                    '--render' => 'errors::503'
                ]);
                $message = 'Application is now in maintenance mode';
            } elseif ($action === 'up') {
                Artisan::call('up');
                $message = 'Application is now live';
            } else {
                return response()->json([
                    'message' => 'Invalid action. Use "down" or "up"'
                ], 422);
            }

            return response()->json([
                'message' => $message,
                'action' => $action
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Maintenance command failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get disk usage information
     */
    private function getDiskUsage()
    {
        $totalSpace = disk_total_space('.');
        $freeSpace = disk_free_space('.');
        $usedSpace = $totalSpace - $freeSpace;

        return [
            'total' => $this->formatBytes($totalSpace),
            'used' => $this->formatBytes($usedSpace),
            'free' => $this->formatBytes($freeSpace),
            'percentage' => round(($usedSpace / $totalSpace) * 100, 2) . '%'
        ];
    }

    /**
     * Get cache size (simplified)
     */
    private function getCacheSize()
    {
        // This is a simplified implementation
        // In production, you'd implement proper cache size calculation
        return 'N/A (Implementation needed for specific cache driver)';
    }

    /**
     * Convert human readable size to bytes
     */
    private function returnBytes($val)
    {
        $val = trim($val);
        $last = strtolower($val[strlen($val)-1]);
        $val = (int) $val;
        
        switch($last) {
            case 'g':
                $val *= 1024;
            case 'm':
                $val *= 1024;
            case 'k':
                $val *= 1024;
        }

        return $val;
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }
}