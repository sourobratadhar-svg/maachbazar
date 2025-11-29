import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const fetchOrders = async () => {
    const response = await fetch(`${API_BASE}/api/orders`);
    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }
    return response.json();
};

const Orders = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: orders, isLoading, error } = useQuery({
        queryKey: ["orders"],
        queryFn: fetchOrders,
    });

    const updateStatus = async (orderId: number, status: string) => {
        try {
            const res = await fetch(`${API_BASE}/api/orders/status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: orderId, status }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            toast({
                title: "Success",
                description: `Order ${status} successfully`,
            });

            // Invalidate query to refresh list
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update order status",
                variant: "destructive",
            });
        }
    };

    if (isLoading) return <div className="p-8">Loading orders...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading orders</div>;

    return (
        <div className="container mx-auto p-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">Customer Orders</CardTitle>
                        <Button asChild variant="outline">
                            <a href="/">Back to Dashboard</a>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders?.map((order: any) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.id}</TableCell>
                                    <TableCell>{order.user_phone}</TableCell>
                                    <TableCell>
                                        <ul className="list-disc list-inside">
                                            {order.order_items?.map((item: any) => (
                                                <li key={item.id}>
                                                    {item.fish_name} ({item.quantity}kg)
                                                </li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                    <TableCell>₹{order.total_price}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === "pending" ? "secondary" : "default"}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {order.status === "pending" && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => updateStatus(order.id, "confirmed")}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => updateStatus(order.id, "rejected")}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Orders;
