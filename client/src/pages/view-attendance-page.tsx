import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";
import { Class, Attendance, Student } from "../../shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ChevronLeft, Loader2, CalendarSearch } from "lucide-react";

const ViewAttendancePage: React.FC = () => {
  const [, navigate] = useLocation();
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch classes
  const { data: classes, isLoading: isLoadingClasses } = useQuery<Class[]>({
    queryKey: ['/api/classes'],
    queryFn: getQueryFn(),
  });

  // Fetch students for selected class
  const { data: students, isLoading: isLoadingStudents } = useQuery<Student[]>({
    queryKey: [`/api/classes/${selectedClass?.id}/students`],
    queryFn: getQueryFn(),
    enabled: !!selectedClass,
  });

  // Fetch attendance records
  const { data: attendanceRecords, isLoading: isLoadingAttendance } = useQuery<Attendance[]>({
    queryKey: [`/api/classes/${selectedClass?.id}/attendance`, { date: selectedDate }],
    queryFn: getQueryFn(),
    enabled: !!selectedClass,
  });

  // Prepare attendance data for display
  const getAttendanceStatus = (studentId: number) => {
    if (!attendanceRecords) return null;
    
    const record = attendanceRecords.find(record => record.studentId === studentId);
    return record?.status || null;
  };

  const getStatusText = (status: string | null) => {
    if (!status) return "Not marked";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusClass = (status: string | null) => {
    switch (status) {
      case 'present':
        return 'text-green-600 bg-green-100';
      case 'absent':
        return 'text-red-600 bg-red-100';
      case 'late':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => selectedClass ? setSelectedClass(null) : navigate("/")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">View Attendance</h1>
          <p className="text-gray-500">
            {selectedClass 
              ? `${selectedClass.name} - ${selectedClass.section}` 
              : "Select a class to view attendance"}
          </p>
        </div>
      </header>
      
      {!selectedClass ? (
        // Class selection view
        <div className="space-y-4">
          {isLoadingClasses ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : classes && classes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map(classItem => (
                <Card 
                  key={classItem.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedClass(classItem)}
                >
                  <CardHeader>
                    <CardTitle>{classItem.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Section: {classItem.section} | Subject: {classItem.subject}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p>No classes found. Please contact the administrator.</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        // Attendance view for selected class
        <div>
          <div className="mb-6">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          {isLoadingStudents || isLoadingAttendance ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : students && students.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map(student => {
                    const status = getAttendanceStatus(student.id);
                    const statusText = getStatusText(status);
                    const statusClass = getStatusClass(status);
                    
                    return (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.rollNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center flex flex-col items-center">
                <CalendarSearch className="h-12 w-12 text-gray-400 mb-4" />
                <p>No students found in this class.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewAttendancePage;
