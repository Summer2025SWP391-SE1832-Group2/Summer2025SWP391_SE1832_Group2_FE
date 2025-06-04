import { useState } from "react";
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
import {Button } from "@/components/ui/button";


// Types
type SampleCollectionSchedule = {
  scheduleId: number;
  bookingId: number;
  collectorId: number;
  collectionDate: string;
  time: string;
  location: string;
  status: string;
};

type Booking = {
  bookingId: number;
  serviceTypeId: number;
  userId: number;
  bookingDate: string;
  sampleMethod: string;
  status: string;
  paymentStatus: string;
  preferredDate: string;
  result: string;
  sampleCollectionSchedules: SampleCollectionSchedule[];
};

// Mock data
const employees = ["Alice", "Bob", "Charlie"];

const bookings: Booking[] = [
  {
    bookingId: 4,
    serviceTypeId: 1,
    userId: 3,
    bookingDate: "2025-06-04T00:00:00",
    sampleMethod: "Online",
    status: "Pending",
    paymentStatus: "Unpaid",
    preferredDate: "2025-06-04T00:00:00",
    result: "Pending",
    sampleCollectionSchedules: [
      {
        scheduleId: 1,
        bookingId: 4,
        collectorId: 10,
        collectionDate: "2025-06-05T09:00:00",
        time: "09:00 AM",
        location: "District 1",
        status: "Scheduled",
      },
    ],
  },
  {
    bookingId: 5,
    serviceTypeId: 2,
    userId: 4,
    bookingDate: "2025-06-05T00:00:00",
    sampleMethod: "Offline",
    status: "Confirmed",
    paymentStatus: "Paid",
    preferredDate: "2025-06-06T00:00:00",
    result: "Confirmed",
    sampleCollectionSchedules: [
      {
        scheduleId: 2,
        bookingId: 5,
        collectorId: 11,
        collectionDate: "2025-06-06T14:00:00",
        time: "02:00 PM",
        location: "District 3",
        status: "Scheduled",
      },
    ],
  },
];

export default function AppointmentsPage() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [assignedEmployee, setAssignedEmployee] = useState("");

  const filteredBookings = bookings.filter(
    (b) =>
      (filterStatus === "" || filterStatus === "All" || b.status === filterStatus) &&
      b.bookingId.toString().includes(search)
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      {/* Filters */}
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
          </SelectContent>
        </Select>
      </div>

      {/* Booking List */}
      {filteredBookings.map((booking) => (
        <Card
          key={booking.bookingId}
          className="hover:shadow-md cursor-pointer"
          onClick={() => setSelectedBooking(booking)}
        >
          <CardContent className="py-6 px-6 space-y-2">
            <div className="text-lg font-semibold text-gray-800">
              Booking #{booking.bookingId} — Service Type #{booking.serviceTypeId}
            </div>
            <div className="text-sm text-gray-600">
              User: {booking.userId} | Status: {booking.status} | Payment: {booking.paymentStatus}
            </div>
            <div className="text-sm text-gray-600">
              Booking Date: {new Date(booking.bookingDate).toLocaleDateString()} | Preferred Date:{" "}
              {new Date(booking.preferredDate).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">
              Sample Method: {booking.sampleMethod} | Result: {booking.result}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>Booking Details</DialogTitle>
    </DialogHeader>

    {selectedBooking && (
      <div className="space-y-6 text-sm text-gray-700">
        {/* Group 1: Status */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="font-semibold mb-2">Status</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><strong>Status:</strong> {selectedBooking.status}</div>
            <div><strong>Result:</strong> {selectedBooking.result}</div>
            <div><strong>Collection Status:</strong> {
              selectedBooking.sampleCollectionSchedules[0]?.status || "N/A"
            }</div>
          </div>
        </div>

        {/* Group 2: Time */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="font-semibold mb-2">Time</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><strong>Preferred Date:</strong> {new Date(selectedBooking.preferredDate).toLocaleDateString()}</div>
            <div><strong>Collection Date:</strong> {
              selectedBooking.sampleCollectionSchedules[0]
                ? new Date(selectedBooking.sampleCollectionSchedules[0].collectionDate).toLocaleString()
                : "N/A"
            }</div>
            <div><strong>Time:</strong> {
              selectedBooking.sampleCollectionSchedules[0]?.time || "N/A"
            }</div>
          </div>
        </div>

        {/* Group 3: Individual Fields */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="font-semibold mb-2">Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Booking ID:</strong> {selectedBooking.bookingId}</div>
            <div><strong>Service Type ID:</strong> {selectedBooking.serviceTypeId}</div>
            <div><strong>User ID:</strong> {selectedBooking.userId}</div>
            <div><strong>Sample Method:</strong> {selectedBooking.sampleMethod}</div>
            <div><strong>Payment Status:</strong> {selectedBooking.paymentStatus}</div>
            <div><strong>Location:</strong> {
              selectedBooking.sampleCollectionSchedules[0]?.location || "N/A"
            }</div>
          </div>
        </div>

        {/* Assign to Employee */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="font-semibold mb-2">Assign to Employee</p>
          <Select value={assignedEmployee} onValueChange={setAssignedEmployee}>
            <SelectTrigger className="w-[180px] mt-1">
              <SelectValue placeholder="Select Staff" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp} value={emp}>{emp}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Optional full schedule listing (if needed) */}
        {selectedBooking.sampleCollectionSchedules.length > 1 && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="font-semibold mb-2">All Sample Collection Schedules</p>
            <ul className="space-y-2 text-xs">
              {selectedBooking.sampleCollectionSchedules.map((s) => (
                <li key={s.scheduleId} className="border p-2 rounded-md bg-white">
                  <div><strong>Schedule ID:</strong> {s.scheduleId}</div>
                  <div><strong>Collector ID:</strong> {s.collectorId}</div>
                  <div><strong>Collection Date:</strong> {new Date(s.collectionDate).toLocaleString()}</div>
                  <div><strong>Time:</strong> {s.time}</div>
                  <div><strong>Location:</strong> {s.location}</div>
                  <div><strong>Status:</strong> {s.status}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
  <div className="flex justify-end gap-3">
    <Button
      // onClick={handleSaveChanges}
      className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
    >
      Save Changes
    </Button>
    <Button
      // onClick={handleCloseDialog}
      className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
    >
      Cancel
    </Button>
  </div>

      </div>
      
    )}
  </DialogContent>
</Dialog>

    </div>
  );
}
