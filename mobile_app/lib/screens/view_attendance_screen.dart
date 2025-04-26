import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/class.dart';
import '../models/attendance.dart';

class ViewAttendanceScreen extends StatefulWidget {
  const ViewAttendanceScreen({Key? key}) : super(key: key);

  @override
  _ViewAttendanceScreenState createState() => _ViewAttendanceScreenState();
}

class _ViewAttendanceScreenState extends State<ViewAttendanceScreen> {
  Class? _selectedClass;
  String _selectedMonth = DateFormat('MMMM yyyy').format(DateTime.now());
  List<Map<String, dynamic>> _attendanceRecords = [];
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

  // Mock data for months
  final List<String> _months = [
    'April 2025',
    'March 2025',
    'February 2025',
    'January 2025',
    'December 2024',
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    // Simulating API call delay
    await Future.delayed(const Duration(seconds: 1));
    
    // Mock attendance records data
    final mockAttendanceRecords = [
      {
        'date': '2025-04-26',
        'present': 28,
        'absent': 2,
        'late': 3,
      },
      {
        'date': '2025-04-25',
        'present': 30,
        'absent': 1,
        'late': 2,
      },
      {
        'date': '2025-04-24',
        'present': 29,
        'absent': 3,
        'late': 1,
      },
      {
        'date': '2025-04-23',
        'present': 31,
        'absent': 0,
        'late': 2,
      },
      {
        'date': '2025-04-22',
        'present': 27,
        'absent': 4,
        'late': 2,
      },
    ];
    
    setState(() {
      _selectedClass = _classes.first;
      _attendanceRecords = mockAttendanceRecords;
      _isLoading = false;
    });
  }

  Future<void> _viewAttendanceDetails(Map<String, dynamic> record) async {
    // In a real app, you would fetch detailed attendance data here
    // For now, we'll just show a dialog with the summary
    
    final date = DateFormat('yyyy-MM-dd').parse(record['date']);
    final formattedDate = DateFormat('EEEE, MMMM d, yyyy').format(date);
    
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Attendance for $formattedDate'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Class: ${_selectedClass?.name ?? ""} ${_selectedClass?.subject ?? ""}'),
            const SizedBox(height: 16),
            _buildAttendanceSummary(
              label: 'Present',
              count: record['present'],
              color: Colors.green,
            ),
            const SizedBox(height: 8),
            _buildAttendanceSummary(
              label: 'Absent',
              count: record['absent'],
              color: Colors.red,
            ),
            const SizedBox(height: 8),
            _buildAttendanceSummary(
              label: 'Late',
              count: record['late'],
              color: Colors.orange,
            ),
            const SizedBox(height: 16),
            Text(
              'Total: ${record['present'] + record['absent'] + record['late']} students',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('CLOSE'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              // In a real app, navigate to a detailed view here
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Detailed view would open here'),
                ),
              );
            },
            child: const Text('VIEW DETAILS'),
          ),
        ],
      ),
    );
  }

  Widget _buildAttendanceSummary({
    required String label,
    required int count,
    required Color color,
  }) {
    return Row(
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          '$label: $count',
          style: TextStyle(
            fontWeight: FontWeight.w500,
            color: color,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('View Attendance'),
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
                        // In a real app, you would fetch attendance records for the selected class here
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  
                  // Month selector
                  DropdownButtonFormField<String>(
                    decoration: const InputDecoration(
                      labelText: 'Select Month',
                      border: OutlineInputBorder(),
                    ),
                    value: _selectedMonth,
                    items: _months.map((String month) {
                      return DropdownMenuItem<String>(
                        value: month,
                        child: Text(month),
                      );
                    }).toList(),
                    onChanged: (String? newValue) {
                      setState(() {
                        _selectedMonth = newValue!;
                        // In a real app, you would fetch attendance records for the selected month here
                      });
                    },
                  ),
                  const SizedBox(height: 24),
                  
                  // Summary card for the selected month
                  Card(
                    elevation: 2,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildSummaryItem(
                            context: context,
                            label: 'Days',
                            value: _attendanceRecords.length.toString(),
                            icon: Icons.calendar_today,
                            color: Colors.blue,
                          ),
                          _buildSummaryItem(
                            context: context,
                            label: 'Present',
                            value: '90%',
                            icon: Icons.check_circle,
                            color: Colors.green,
                          ),
                          _buildSummaryItem(
                            context: context,
                            label: 'Absent',
                            value: '6%',
                            icon: Icons.cancel,
                            color: Colors.red,
                          ),
                          _buildSummaryItem(
                            context: context,
                            label: 'Late',
                            value: '4%',
                            icon: Icons.access_time,
                            color: Colors.orange,
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  Text(
                    'Attendance Records',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 8),
                  
                  // Attendance records list
                  Expanded(
                    child: ListView.builder(
                      itemCount: _attendanceRecords.length,
                      itemBuilder: (context, index) {
                        final record = _attendanceRecords[index];
                        final date = DateFormat('yyyy-MM-dd').parse(record['date']);
                        final formattedDate = DateFormat('MMMM d, yyyy').format(date);
                        final total = record['present'] + record['absent'] + record['late'];
                        
                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: InkWell(
                            onTap: () => _viewAttendanceDetails(record),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        formattedDate,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                      ),
                                      IconButton(
                                        icon: const Icon(Icons.visibility),
                                        onPressed: () => _viewAttendanceDetails(record),
                                        tooltip: 'View Details',
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  
                                  // Attendance progress bar
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(4),
                                    child: Container(
                                      height: 10,
                                      child: Row(
                                        children: [
                                          // Present
                                          Expanded(
                                            flex: record['present'],
                                            child: Container(color: Colors.green),
                                          ),
                                          // Absent
                                          Expanded(
                                            flex: record['absent'],
                                            child: Container(color: Colors.red),
                                          ),
                                          // Late
                                          Expanded(
                                            flex: record['late'],
                                            child: Container(color: Colors.orange),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  
                                  // Attendance summary
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                                    children: [
                                      Text('Present: ${record['present']}'),
                                      Text('Absent: ${record['absent']}'),
                                      Text('Late: ${record['late']}'),
                                      Text('Total: $total'),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildSummaryItem({
    required BuildContext context,
    required String label,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Column(
      children: [
        Icon(
          icon,
          color: color,
          size: 24,
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            color: Colors.grey.shade600,
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}