import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

interface InventoryItem {
  id: number;
  name: string;
  price: number;
  is_available: boolean;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Index = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/inventory`);
      const data = await res.json();
      setInventory(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch inventory",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const updateItem = async (id: number, price: number, is_available: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/api/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price, is_available }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Item updated successfully",
        });
        fetchInventory();
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const addFish = async (name: string, price: number, is_available: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/api/inventory/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, is_available }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Fish added successfully",
        });
        fetchInventory();
      } else {
        throw new Error("Add failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add fish",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold text-center">
                🐟 Maachbazar Admin Dashboard
              </CardTitle>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <a href="/prices">View Daily Prices</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/orders">View Orders</a>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Fish Name</TableHead>
                    <TableHead>Price (₹/kg)</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <InventoryRow
                      key={item.id}
                      item={item}
                      onUpdate={updateItem}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <AddFishForm onAdd={addFish} />
      </div>
    </div>
  );
};

interface InventoryRowProps {
  item: InventoryItem;
  onUpdate: (id: number, price: number, is_available: boolean) => void;
}

const InventoryRow = ({ item, onUpdate }: InventoryRowProps) => {
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(item.price);
  const [available, setAvailable] = useState(item.is_available);

  const handleSave = () => {
    onUpdate(item.id, price, available);
    setEditing(false);
  };

  return (
    <TableRow>
      <TableCell>{item.id}</TableCell>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell>
        {editing ? (
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-24"
          />
        ) : (
          `₹${item.price}`
        )}
      </TableCell>
      <TableCell>
        {editing ? (
          <Checkbox
            checked={available}
            onCheckedChange={(checked) => setAvailable(checked as boolean)}
          />
        ) : available ? (
          <span className="text-green-600">✓ Yes</span>
        ) : (
          <span className="text-red-600">✗ No</span>
        )}
      </TableCell>
      <TableCell>
        {editing ? (
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              Save
            </Button>
            <Button
              onClick={() => setEditing(false)}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setEditing(true)} variant="outline" size="sm">
            Edit
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

interface AddFishFormProps {
  onAdd: (name: string, price: number, is_available: boolean) => void;
}

const AddFishForm = ({ onAdd }: AddFishFormProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    onAdd(name, Number(price), available);
    setName("");
    setPrice("");
    setAvailable(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">➕ Add New Fish</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Fish Name</label>
              <Input
                placeholder="e.g., Pomfret"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Price (₹/kg)</label>
              <Input
                type="number"
                placeholder="e.g., 500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={available}
                  onCheckedChange={(checked) => setAvailable(checked as boolean)}
                />
                <label htmlFor="available" className="text-sm font-medium">
                  Available
                </label>
              </div>
              <Button type="submit" className="ml-auto">
                Add Fish
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Index;
