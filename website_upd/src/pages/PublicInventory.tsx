import { useQuery } from "@tanstack/react-query";
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

const fetchInventory = async () => {
    const response = await fetch(`${API_BASE}/api/inventory`);
    if (!response.ok) {
        throw new Error("Failed to fetch inventory");
    }
    return response.json();
};

const PublicInventory = () => {
    const { data: inventory, isLoading, error } = useQuery({
        queryKey: ["inventory"],
        queryFn: fetchInventory,
    });

    if (isLoading) return <div className="p-8 text-center text-lg">Loading fresh catches... 🐟</div>;
    if (error) return <div className="p-8 text-red-500 text-center">Error loading prices. Please try again later.</div>;

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <Card className="shadow-lg border-t-4 border-t-emerald-600">
                <CardHeader className="text-center">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-3xl font-bold text-emerald-800">
                            🐟 Today's Price List
                        </CardTitle>
                        <Button asChild variant="outline">
                            <a href="/">Back Home</a>
                        </Button>
                    </div>
                    <p className="text-gray-500 mt-2">Fresh fish available for delivery today!</p>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-emerald-50">
                                <TableHead className="text-emerald-700 font-bold">Fish Name</TableHead>
                                <TableHead className="text-emerald-700 font-bold">Price (per kg)</TableHead>
                                <TableHead className="text-emerald-700 font-bold">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory?.map((item: any) => (
                                <TableRow key={item.id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium text-lg">{item.name}</TableCell>
                                    <TableCell className="text-lg">₹{item.price}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.is_available ? "default" : "secondary"} className={item.is_available ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
                                            {item.is_available ? "In Stock" : "Sold Out"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="mt-8 text-center bg-emerald-50 p-4 rounded-lg">
                        <p className="text-lg font-medium text-emerald-800">Want to order?</p>
                        <p className="text-gray-600">Message our WhatsApp Bot now!</p>
                        <Button className="mt-2 bg-green-600 hover:bg-green-700">
                            Chat on WhatsApp 💬
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PublicInventory;
