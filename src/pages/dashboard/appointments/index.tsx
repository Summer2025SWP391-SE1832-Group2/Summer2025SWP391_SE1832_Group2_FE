import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { BookingSchedule } from "@/types/booking";
import type { UserStaff } from "@/types/user";

import { getAllBookingSchedule, getStaffForSchedule, AssignStaffForSchedule } from "@/services/booking_service";

export default function AppointmentsPage() {
  const [selectedBooking, setSelectedBooking] = useState<BookingSchedule | null>(null);
  const [bookings, setBookings] = useState<BookingSchedule[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [employees, setEmployees] = useState<UserStaff[]>([]);
  const [assignedEmployee, setAssignedEmployee] = useState("");

  const filteredBookings = bookings.filter((b) => {
    const statusMatch =
      filterStatus === "" || filterStatus === "All"
        ? true
        : filterStatus === "NoCollector"
        ? b.sampleCollectionSchedules.some(scs => scs.collectorId == null)
        : b.status === filterStatus;
    return statusMatch && b.bookingId.toString().includes(search);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllBookingSchedule();
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };
    fetchData();
  }, []);

  const handleBookingClick = async (booking: BookingSchedule) => {
    setSelectedBooking(booking);
    setAssignedEmployee("");
    const scheduleId = booking.sampleCollectionSchedules?.[0]?.scheduleId;
    if (!scheduleId) {
      setEmployees([]);
      return;
    }
    try {
      const staffList = await getStaffForSchedule(scheduleId);
      setEmployees(staffList);
    } catch (error) {
      console.error("Failed to fetch staff for schedule:", error);
      setEmployees([]);
    }
  };

  const handleSaveAssignment = async () => {
    if (!selectedBooking || !assignedEmployee) {
      alert("Please select a booking and an employee.");
      return;
    }
    const scheduleId = selectedBooking.sampleCollectionSchedules?.[0]?.scheduleId;
    const staffId = parseInt(assignedEmployee);
    if (!scheduleId || !staffId) {
      alert("Missing schedule or staff ID.");
      return;
    }
    try {
      await AssignStaffForSchedule(scheduleId, staffId);
      alert("Staff assigned successfully!");
      setSelectedBooking(null);
      const updatedBookings = await getAllBookingSchedule();
      setBookings(updatedBookings);
    } catch (error) {
      console.error("Assignment failed:", error);
      alert("Failed to assign staff.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center gap-4 mb-4">
        <Input
          placeholder="Search by Booking ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="NoCollector">No Collector</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredBookings.map((booking) => (
        <Card
          key={booking.bookingId}
          className="hover:shadow-md cursor-pointer"
          onClick={() => handleBookingClick(booking)}
        >
          <CardContent className="py-6 px-6 space-y-2">
            <div className="text-lg font-semibold text-gray-800">
              Booking #{booking.bookingId} — Service Type #{booking.serviceTypeId}
            </div>
            <div className="text-sm text-gray-600">
              User: {booking.userId} | Status: {booking.status} | Payment: {booking.paymentStatus}
            </div>
            <div className="text-sm text-gray-600">
              Booking Date: {new Date(booking.bookingDate).toLocaleDateString()} | Preferred Date: {new Date(booking.preferredDate).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">
              Sample Method: {booking.sampleMethod} | Result: {booking.result}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
      <DialogContent className="!w-full !max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="font-semibold mb-2">Details</p>
                <div className="space-y-1">
                  <div><strong>Booking ID:</strong> {selectedBooking.bookingId}</div>
                  <div><strong>Service Type ID:</strong> {selectedBooking.serviceTypeId}</div>
                  <div><strong>User ID:</strong> {selectedBooking.userId}</div>
                  <div><strong>Sample Method:</strong> {selectedBooking.sampleMethod}</div>
                  <div><strong>Payment Status:</strong> {selectedBooking.paymentStatus}</div>
                  <div><strong>Location:</strong> {selectedBooking.sampleCollectionSchedules[0]?.location || "N/A"}</div>
                </div>
              </div>

              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="font-semibold mb-2">Time</p>
                <div className="space-y-1">
                  <div><strong>Preferred Date:</strong> {new Date(selectedBooking.preferredDate).toLocaleDateString()}</div>
                  <div><strong>Collection Date:</strong> {selectedBooking.sampleCollectionSchedules[0] ? new Date(selectedBooking.sampleCollectionSchedules[0].collectionDate).toLocaleString() : "N/A"}</div>
                  <div><strong>Time:</strong> {selectedBooking.sampleCollectionSchedules[0]?.time || "N/A"}</div>
                </div>
              </div>

              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="font-semibold mb-2">Status</p>
                <div className="space-y-1">
                  <div><strong>Status:</strong> {selectedBooking.status}</div>
                  <div><strong>Result:</strong> {selectedBooking.result}</div>
                  <div><strong>Collection Status:</strong> {selectedBooking.sampleCollectionSchedules[0]?.status || "N/A"}</div>
                </div>
              </div>

              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="font-semibold mb-2">Assign to Employee</p>
                <Select value={assignedEmployee} onValueChange={setAssignedEmployee}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select Staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.length === 0 && (
                      <SelectItem value="NULL" disabled>No staff available</SelectItem>
                    )}
                    {employees
                      .filter(emp => emp.userId !== null && emp.userId !== undefined)
                      .map((emp) => (
                        <SelectItem key={emp.userId} value={emp.userId.toString()}>
                          {emp.fullName}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition" onClick={handleSaveAssignment}>
              Save Changes
            </Button>
            <Button className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition" onClick={() => setSelectedBooking(null)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
