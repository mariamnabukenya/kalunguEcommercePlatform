<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminOrderController extends Controller
{
    /**
     * Display a listing of orders
     */
    public function index(Request $request)
    {
        $query = Order::query();

        // Date range filter
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Sorting
        if ($request->filled('sort_by') && $request->filled('sort_order')) {
            $query->orderBy($request->sort_by, $request->sort_order);
        } else {
            $query->latest();
        }

        return response()->json($query->paginate(20));
    }

    /**
     * Display the specified order
     */
    public function show($id)
    {
        $order = Order::with('items.product', 'user')->find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json($order);
    }

    /**
     * Update order status
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        $data = $request->only('status');
        $oldStatus = $order->status;

        if ($data['status'] === 'shipped' && $oldStatus !== 'shipped') {
            $data['shipped_at'] = now();

            if ($order->payment_status !== 'paid') {
                $data['payment_status'] = 'paid';
            }
        }

        if ($data['status'] === 'delivered' && $oldStatus !== 'delivered') {
            if (!$order->shipped_at) {
                $data['shipped_at'] = now();
            }

            if ($order->payment_status !== 'paid') {
                $data['payment_status'] = 'paid';
            }
        }

        $order->update($data);

        return response()->json([
            'message' => 'Order updated successfully',
            'order'   => $order
        ]);
    }

    /**
     * Remove the specified order
     */
    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        // Only allow deletion of cancelled orders
        if ($order->status !== 'cancelled') {
            return response()->json([
                'message' => 'Only cancelled orders can be deleted'
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Delete order items first
            $order->items()->delete();

            // Delete the order
            $order->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete order',
                'error'   => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Dashboard summary stats
     */
    public function dashboard(Request $request)
    {
        $period = $request->get('period', 30);
        $startDate = now()->subDays($period);

        $dashboard = [
            'total_orders'        => Order::count(),
            'total_revenue'       => Order::where('payment_status', 'paid')->sum('total_amount'),
            'average_order_value' => Order::where('payment_status', 'paid')->avg('total_amount'),
            'total_customers'     => User::where('role', 'customer')->count(),

            // Period stats
            'period_orders'   => Order::where('created_at', '>=', $startDate)->count(),
            'period_revenue'  => Order::where('created_at', '>=', $startDate)
                                      ->where('payment_status', 'paid')
                                      ->sum('total_amount'),
            'period_customers'=> User::where('role', 'customer')
                                      ->where('created_at', '>=', $startDate)
                                      ->count(),

            // Status breakdown
            'status_breakdown'=> Order::select('status', DB::raw('count(*) as count'))
                                      ->groupBy('status')
                                      ->get(),

            // Daily revenue (last 30 days)
            'daily_revenue'   => Order::selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue')
                                      ->where('created_at', '>=', now()->subDays(30))
                                      ->where('payment_status', 'paid')
                                      ->groupBy('date')
                                      ->orderBy('date')
                                      ->get(),
        ];

        return response()->json($dashboard);
    }
}
