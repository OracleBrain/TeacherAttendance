import React, { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "../lib/queryClient";
import { Class, Student } from "../../shared/schema";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Loader2, ChevronLeft } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const MarkAttendancePage: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Current date in YYYY-MM-DD format
  const [attendance, setAttendance] = useState<Record<number, 'present' | 'absent' | 'late'>>({});

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

  // Mark attendance mutation
  const markAttendanceMutation = useMutation({
    mutationFn: async (data: { studentId: number, status: 'present' | 'absent' | 'late' }) => {
      await apiRequest('POST', '/api/attendance', {
        studentId: data.studentId,
        classId: selectedClass?.id,
        date,
        status: data.status,
      });
    },
    onSuccess: () => {
      toast({
        title: "Attendance recorded",
        description: "Student attendance has been updated successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to record attendance",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Submit all attendance records
  const submitAttendance = async () => {
    if (!selectedClass) return;
    
    try {
      // Submit each attendance record
      for (const [studentIdStr, status] of Object.entries(attendance)) {
        const studentId = parseInt(studentIdStr, 10);
        await markAttendanceMutation.mutateAsync({ studentId, status });
      }
      
      // Navigate back to dashboard after completion
      toast({
        title: "Attendance completed",
        description: `Attendance for ${selectedClass.name} has been recorded.`
      });
      setSelectedClass(null);
      setAttendance({});
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };

  const handleAttendanceChange = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
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
          <h1 className="text-2xl font-bold">Mark Attendance</h1>
          <p className="text-gray-500">
            {selectedClass 
              ? `${selectedClass.name} - ${selectedClass.section}` 
              : "Select a class to mark attendance"}
          </p>
        </div>
      </header>

      {!selectedClass ? (
        // Class selection view
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <Input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
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
        // Student attendance view
        <div>
          <div className="mb-4 flex justify-between items-center">
            <Input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          {isLoadingStudents ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : students && students.length > 0 ? (
            <>
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
                    {students.map(student => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.rollNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                              className={attendance[student.id] === 'present' ? 'bg-green-500 hover:bg-green-600' : ''}
                              onClick={() => handleAttendanceChange(student.id, 'present')}
                            >
                              Present
                            </Button>
                            <Button
                              size="sm"
                              variant={attendance[student.id] === 'absent' ? 'default' : 'outline'}
                              className={attendance[student.id] === 'absent' ? 'bg-red-500 hover:bg-red-600' : ''}
                              onClick={() => handleAttendanceChange(student.id, 'absent')}
                            >
                              Absent
                            </Button>
                            <Button
                              size="sm"
                              variant={attendance[student.id] === 'late' ? 'default' : 'outline'}
                              className={attendance[student.id] === 'late' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                              onClick={() => handleAttendanceChange(student.id, 'late')}
                            >
                              Late
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={submitAttendance}
                  disabled={
                    Object.keys(attendance).length === 0 || 
                    markAttendanceMutation.isPending
                  }
                >
                  {markAttendanceMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Attendance
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p>No students found in this class.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkAttendancePage;
