import React from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";
import { Class } from "../../shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChevronLeft, Loader2, BookOpen } from "lucide-react";

const MyClassesPage: React.FC = () => {
  const [, navigate] = useLocation();
  
  // Fetch classes
  const { data: classes, isLoading } = useQuery<Class[]>({
    queryKey: ['/api/classes'],
    queryFn: getQueryFn(),
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">My Classes</h1>
          <p className="text-gray-500">View and manage your assigned classes</p>
        </div>
      </header>
      
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : classes && classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map(classItem => (
            <Card key={classItem.id} className="overflow-hidden">
              <div className="h-2 bg-blue-500"></div>
              <CardHeader>
                <CardTitle>{classItem.name}</CardTitle>
                <CardDescription>
                  Section: {classItem.section}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Subject</p>
                    <p className="text-sm text-gray-500">{classItem.subject}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/mark-attendance`)}
                    >
                      Mark Attendance
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/view-attendance`)}
                    >
                      View Records
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center flex flex-col items-center">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Classes Assigned</h3>
            <p className="text-gray-500">
              You don't have any classes assigned to you yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyClassesPage;
