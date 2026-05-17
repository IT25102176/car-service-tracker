import { useState, useMemo } from "react";
import { UserForm } from "./UserForm";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit, Search } from "lucide-react";

export function UsersList({ users, onAdd, onUpdate, onDelete }) {
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = (user) => {
    const existing = users.find((u) => u.id === user.id);
    existing ? onUpdate(user) : onAdd(user);
  };

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.phone.includes(searchQuery),
      ),
    [users, searchQuery],
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{ fontFamily: "Phudu, sans-serif", fontWeight: 700 }}
            className="text-4xl text-gray-900"
          >
            User Management
          </h1>
          <p className="text-gray-600 mt-1 text-sm">Manage your team members</p>
        </div>
        <UserForm
          onSave={onAdd}
          trigger={
            <Button className="bg-gray-800 text-md text-white hover:bg-gray-900 rounded-4xl px-8 py-5">
              + Add Person
            </Button>
          }
        />
      </div>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-0 focus:border-gray-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-gray-300 rounded-2xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">
                  {user.name}
                </h3>
                <p className="text-gray-600 text-xs mt-1">{user.email}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                  user.role === "admin"
                    ? "bg-red-100 text-red-700"
                    : user.role === "manager"
                      ? "bg-blue-100 text-blue-700"
                      : user.role === "technician"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {user.role}
              </span>
            </div>
            <p className="text-gray-700 text-xs mb-4">{user.phone}</p>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
              <UserForm
                user={user}
                onSave={handleSave}
                trigger={
                  <button className="flex-1 p-2 border border-gray-400 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl text-xs font-medium">
                    <Edit size={14} className="inline mr-1" />
                    Edit
                  </button>
                }
              />
              <button
                onClick={() => setDeleteId(user.id)}
                className="flex-1 p-2 text-white bg-red-500 hover:text-white rounded-xl text-xs font-medium"
              >
                <Trash2 size={14} className="inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No people found</p>
        </div>
      )}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) onDelete(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
