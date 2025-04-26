import 'package:flutter/material.dart';
import '../models/class.dart';
import '../models/student.dart';

class MyClassesScreen extends StatefulWidget {
  const MyClassesScreen({Key? key}) : super(key: key);

  @override
  _MyClassesScreenState createState() => _MyClassesScreenState();
}

class _MyClassesScreenState extends State<MyClassesScreen> {
  List<Class> _classes = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadClasses();
  }

  Future<void> _loadClasses() async {
    // Simulating API call delay
    await Future.delayed(const Duration(seconds: 1));
    
    // Mock classes data
    final mockClasses = [
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
    
    setState(() {
      _classes = mockClasses;
      _isLoading = false;
    });
  }

  void _viewClassDetails(Class classInfo) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => ClassDetailScreen(classInfo: classInfo),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Classes'),
      ),
      body: _isLoading 
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Your assigned classes',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Tap on a class to view details and students',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 24),
                  
                  // Classes list
                  Expanded(
                    child: ListView.builder(
                      itemCount: _classes.length,
                      itemBuilder: (context, index) {
                        final classInfo = _classes[index];
                        return _buildClassCard(classInfo);
                      },
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildClassCard(Class classInfo) {
    // Define schedule based on class ID (mock data)
    String schedule;
    int studentCount;
    
    switch (classInfo.id) {
      case 1:
        schedule = 'Mon, Wed, Fri (9:00 AM)';
        studentCount = 33;
        break;
      case 2:
        schedule = 'Tue, Thu (10:30 AM)';
        studentCount = 28;
        break;
      case 3:
        schedule = 'Mon, Wed (2:00 PM)';
        studentCount = 25;
        break;
      default:
        schedule = 'Not scheduled';
        studentCount = 0;
    }
    
    // Define a color based on the class ID
    final colors = [
      Colors.blue,
      Colors.green,
      Colors.purple,
      Colors.orange,
      Colors.teal,
    ];
    final color = colors[classInfo.id % colors.length];
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: () => _viewClassDetails(classInfo),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Class color indicator
              Container(
                width: 12,
                height: 100,
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(6),
                ),
              ),
              const SizedBox(width: 16),
              
              // Class details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${classInfo.name}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Subject: ${classInfo.subject}',
                      style: TextStyle(
                        color: Colors.grey.shade700,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Section: ${classInfo.section}',
                      style: TextStyle(
                        color: Colors.grey.shade700,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Students: $studentCount',
                      style: TextStyle(
                        color: Colors.grey.shade700,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Schedule: $schedule',
                      style: TextStyle(
                        color: Colors.grey.shade700,
                        fontSize: 14,
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Action buttons
                    Row(
                      children: [
                        OutlinedButton.icon(
                          icon: const Icon(Icons.visibility),
                          label: const Text('View'),
                          onPressed: () => _viewClassDetails(classInfo),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton.icon(
                          icon: const Icon(Icons.how_to_reg),
                          label: const Text('Attendance'),
                          onPressed: () {
                            // Navigate to mark attendance screen with this class pre-selected
                            Navigator.of(context).pushNamed('/mark-attendance');
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class ClassDetailScreen extends StatefulWidget {
  final Class classInfo;
  
  const ClassDetailScreen({
    Key? key,
    required this.classInfo,
  }) : super(key: key);

  @override
  _ClassDetailScreenState createState() => _ClassDetailScreenState();
}

class _ClassDetailScreenState extends State<ClassDetailScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<Student> _students = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadStudents();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadStudents() async {
    // Simulating API call delay
    await Future.delayed(const Duration(seconds: 1));
    
    // Mock students data based on the class ID
    List<Student> mockStudents = [];
    
    // Generate different students for each class
    for (int i = 1; i <= 10; i++) {
      final baseId = (widget.classInfo.id - 1) * 100 + i;
      mockStudents.add(
        Student(
          id: baseId,
          name: 'Student $baseId',
          rollNumber: '${widget.classInfo.id}$i'.padLeft(3, '0'),
          classId: widget.classInfo.id,
        ),
      );
    }
    
    setState(() {
      _students = mockStudents;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.classInfo.name} Details'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'INFO'),
            Tab(text: 'STUDENTS'),
          ],
        ),
      ),
      body: _isLoading 
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                // Class information tab
                _buildClassInfoTab(),
                
                // Students list tab
                _buildStudentsTab(),
              ],
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // In a real app, this would navigate to attendance marking screen
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Mark attendance feature would open here'),
            ),
          );
        },
        child: const Icon(Icons.how_to_reg),
        tooltip: 'Mark Attendance',
      ),
    );
  }

  Widget _buildClassInfoTab() {
    // Define schedule based on class ID (mock data)
    String schedule;
    int studentCount;
    
    switch (widget.classInfo.id) {
      case 1:
        schedule = 'Mon, Wed, Fri (9:00 AM)';
        studentCount = 33;
        break;
      case 2:
        schedule = 'Tue, Thu (10:30 AM)';
        studentCount = 28;
        break;
      case 3:
        schedule = 'Mon, Wed (2:00 PM)';
        studentCount = 25;
        break;
      default:
        schedule = 'Not scheduled';
        studentCount = 0;
    }
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Class info card
          Card(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Class Information',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const Divider(),
                  _buildInfoRow(
                    label: 'Class Name',
                    value: widget.classInfo.name,
                    icon: Icons.class_,
                  ),
                  _buildInfoRow(
                    label: 'Subject',
                    value: widget.classInfo.subject,
                    icon: Icons.book,
                  ),
                  _buildInfoRow(
                    label: 'Section',
                    value: widget.classInfo.section,
                    icon: Icons.group,
                  ),
                  _buildInfoRow(
                    label: 'Schedule',
                    value: schedule,
                    icon: Icons.schedule,
                  ),
                  _buildInfoRow(
                    label: 'Total Students',
                    value: studentCount.toString(),
                    icon: Icons.people,
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Attendance summary card
          Card(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Attendance Summary',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const Divider(),
                  const SizedBox(height: 16),
                  
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildAttendanceStatItem(
                        label: 'Present',
                        percent: '92%',
                        color: Colors.green,
                      ),
                      _buildAttendanceStatItem(
                        label: 'Absent',
                        percent: '5%',
                        color: Colors.red,
                      ),
                      _buildAttendanceStatItem(
                        label: 'Late',
                        percent: '3%',
                        color: Colors.orange,
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 16),
                  
                  ElevatedButton.icon(
                    onPressed: () {
                      // Navigate to view attendance screen with this class pre-selected
                      Navigator.of(context).pushNamed('/view-attendance');
                    },
                    icon: const Icon(Icons.assessment),
                    label: const Text('View Detailed Attendance'),
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 40),
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Action buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    // In a real app, this would open a form to create a notice
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Notice feature would open here'),
                      ),
                    );
                  },
                  icon: const Icon(Icons.announcement),
                  label: const Text('Create Notice'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    // In a real app, this would generate a report
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Report feature would open here'),
                      ),
                    );
                  },
                  icon: const Icon(Icons.summarize),
                  label: const Text('Generate Report'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStudentsTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: _students.length,
      itemBuilder: (context, index) {
        final student = _students[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: CircleAvatar(
              child: Text(student.name.substring(0, 1)),
            ),
            title: Text(student.name),
            subtitle: Text('Roll No: ${student.rollNumber}'),
            trailing: IconButton(
              icon: const Icon(Icons.more_vert),
              onPressed: () {
                // Show student options
                showModalBottomSheet(
                  context: context,
                  shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(16),
                    ),
                  ),
                  builder: (context) => _buildStudentOptionsSheet(student),
                );
              },
            ),
          ),
        );
      },
    );
  }

  Widget _buildStudentOptionsSheet(Student student) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            leading: const Icon(Icons.how_to_reg),
            title: const Text('View Attendance'),
            onTap: () {
              Navigator.pop(context);
              // In a real app, navigate to student's attendance details
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Viewing attendance for ${student.name}'),
                ),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.email),
            title: const Text('Contact Parent'),
            onTap: () {
              Navigator.pop(context);
              // In a real app, open email or messaging screen
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Contacting parents of ${student.name}'),
                ),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.assessment),
            title: const Text('Performance'),
            onTap: () {
              Navigator.pop(context);
              // In a real app, show student performance report
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Performance report for ${student.name}'),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow({
    required String label,
    required String value,
    required IconData icon,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(
            icon,
            color: Colors.blue,
            size: 20,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontSize: 12,
                  ),
                ),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAttendanceStatItem({
    required String label,
    required String percent,
    required Color color,
  }) {
    return Column(
      children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: color.withOpacity(0.2),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              percent,
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: TextStyle(
            color: color,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}