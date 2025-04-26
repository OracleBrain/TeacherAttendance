import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/student.dart';
import '../models/class.dart';

class MarkAttendanceScreen extends StatefulWidget {
  const MarkAttendanceScreen({Key? key}) : super(key: key);

  @override
  _MarkAttendanceScreenState createState() => _MarkAttendanceScreenState();
}

class _MarkAttendanceScreenState extends State<MarkAttendanceScreen> {
  Class? _selectedClass;
  DateTime _selectedDate = DateTime.now();
  List<Student> _students = [];
  Map<int, String> _attendanceStatus = {};
  bool _isLoading = true;

  // Mock data for classes
  final List<Class> _classes = [
    Class(
      id: 1, 
      name: 'Class 10-A', 
      section: 'A', 
      subject: 'Mathematics', 
      teacherId: 1
    ),
    Class(
      id: 2, 
      name: 'Class 9-B', 
      section: 'B', 
      subject: 'Science', 
      teacherId: 1
    ),
    Class(
      id: 3, 
      name: 'Class 11-C', 
      section: 'C', 
      subject: 'Physics', 
      teacherId: 1
    ),
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    // Simulating API call delay
    await Future.delayed(const Duration(seconds: 1));
    
    // Mock students data
    final mockStudents = [
      Student(id: 1, name: 'John Doe', rollNumber: '101', classId: 1),
      Student(id: 2, name: 'Jane Smith', rollNumber: '102', classId: 1),
      Student(id: 3, name: 'Michael Johnson', rollNumber: '103', classId: 1),
      Student(id: 4, name: 'Emily Wilson', rollNumber: '104', classId: 1),
      Student(id: 5, name: 'David Brown', rollNumber: '105', classId: 1),
    ];
    
    // Initialize all students as 'present'
    final Map<int, String> initialStatus = {};
    for (var student in mockStudents) {
      initialStatus[student.id] = 'present';
    }
    
    setState(() {
      _selectedClass = _classes.first;
      _students = mockStudents;
      _attendanceStatus = initialStatus;
      _isLoading = false;
    });
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2023),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: Theme.of(context).primaryColor,
            ),
          ),
          child: child!,
        );
      },
    );
    
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  void _changeAttendanceStatus(int studentId, String status) {
    setState(() {
      _attendanceStatus[studentId] = status;
    });
  }

  Future<void> _submitAttendance() async {
    setState(() {
      _isLoading = true;
    });
    
    // Simulating API call
    await Future.delayed(const Duration(seconds: 1));
    
    // In a real app, you would send the data to your backend here
    
    setState(() {
      _isLoading = false;
    });
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Attendance submitted successfully!'),
          backgroundColor: Colors.green,
        ),
      );
      
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mark Attendance'),
      ),
      body: _isLoading 
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Class selector
                  DropdownButtonFormField<Class>(
                    decoration: const InputDecoration(
                      labelText: 'Select Class',
                      border: OutlineInputBorder(),
                    ),
                    value: _selectedClass,
                    items: _classes.map((Class class_) {
                      return DropdownMenuItem<Class>(
                        value: class_,
                        child: Text('${class_.name} ${class_.subject}'),
                      );
                    }).toList(),
                    onChanged: (Class? newValue) {
                      setState(() {
                        _selectedClass = newValue;
                        // In a real app, you would fetch students for the selected class here
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  
                  // Date selector
                  InkWell(
                    onTap: () => _selectDate(context),
                    child: InputDecorator(
                      decoration: const InputDecoration(
                        labelText: 'Date',
                        border: OutlineInputBorder(),
                        suffixIcon: Icon(Icons.calendar_today),
                      ),
                      child: Text(
                        DateFormat('EEEE, MMMM d, yyyy').format(_selectedDate),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  Text(
                    'Students',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 8),
                  
                  // Students list
                  Expanded(
                    child: ListView.builder(
                      itemCount: _students.length,
                      itemBuilder: (context, index) {
                        final student = _students[index];
                        final status = _attendanceStatus[student.id] ?? 'present';
                        
                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: Padding(
                            padding: const EdgeInsets.all(12.0),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  child: Text(student.name.substring(0, 1)),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        student.name,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                      ),
                                      Text(
                                        'Roll No: ${student.rollNumber}',
                                        style: TextStyle(
                                          color: Colors.grey.shade600,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                
                                // Attendance status radio buttons
                                Row(
                                  children: [
                                    // Present
                                    Radio<String>(
                                      value: 'present',
                                      groupValue: status,
                                      onChanged: (value) {
                                        _changeAttendanceStatus(student.id, value!);
                                      },
                                    ),
                                    const Text('P'),
                                    
                                    // Absent
                                    Radio<String>(
                                      value: 'absent',
                                      groupValue: status,
                                      onChanged: (value) {
                                        _changeAttendanceStatus(student.id, value!);
                                      },
                                    ),
                                    const Text('A'),
                                    
                                    // Late
                                    Radio<String>(
                                      value: 'late',
                                      groupValue: status,
                                      onChanged: (value) {
                                        _changeAttendanceStatus(student.id, value!);
                                      },
                                    ),
                                    const Text('L'),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  
                  // Submit button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _submitAttendance,
                      child: const Text(
                        'SUBMIT ATTENDANCE',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}