import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import 'mark_attendance_screen.dart';
import 'view_attendance_screen.dart';
import 'my_classes_screen.dart';
import 'notifications_screen.dart';
import 'profile_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final userName = authService.currentUser?.name ?? 'Teacher';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Teacher Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              showDialog(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text('Logout'),
                  content: const Text('Are you sure you want to logout?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.of(ctx).pop(),
                      child: const Text('CANCEL'),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.of(ctx).pop();
                        authService.logout();
                      },
                      child: const Text('LOGOUT'),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome message
              Text(
                'Welcome, $userName',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Text(
                'What would you like to do today?',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 24),
              
              // Dashboard grid
              GridView.count(
                crossAxisCount: 2,
                childAspectRatio: 1.2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                children: [
                  // Mark Attendance
                  _buildDashboardCard(
                    context: context,
                    title: 'Mark Attendance',
                    icon: Icons.how_to_reg,
                    color: Colors.indigo,
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => const MarkAttendanceScreen(),
                        ),
                      );
                    },
                  ),
                  
                  // View Attendance
                  _buildDashboardCard(
                    context: context,
                    title: 'View Attendance',
                    icon: Icons.assessment,
                    color: Colors.green,
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => const ViewAttendanceScreen(),
                        ),
                      );
                    },
                  ),
                  
                  // My Classes
                  _buildDashboardCard(
                    context: context,
                    title: 'My Classes',
                    icon: Icons.class_,
                    color: Colors.orange,
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => const MyClassesScreen(),
                        ),
                      );
                    },
                  ),
                  
                  // Notifications
                  _buildDashboardCard(
                    context: context,
                    title: 'Notifications',
                    icon: Icons.notifications,
                    color: Colors.red,
                    showBadge: true,
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => const NotificationsScreen(),
                        ),
                      );
                    },
                  ),
                  
                  // Profile
                  _buildDashboardCard(
                    context: context,
                    title: 'Profile',
                    icon: Icons.person,
                    color: Colors.purple,
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => const ProfileScreen(),
                        ),
                      );
                    },
                  ),
                ],
              ),
              
              const SizedBox(height: 24),
              
              // Recent activities section
              _buildRecentActivities(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDashboardCard({
    required BuildContext context,
    required String title,
    required IconData icon,
    required Color color,
    bool showBadge = false,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Stack(
                alignment: Alignment.center,
                children: [
                  CircleAvatar(
                    backgroundColor: color.withOpacity(0.2),
                    radius: 30,
                    child: Icon(
                      icon,
                      color: color,
                      size: 30,
                    ),
                  ),
                  if (showBadge)
                    Positioned(
                      top: 0,
                      right: 0,
                      child: Container(
                        width: 18,
                        height: 18,
                        decoration: BoxDecoration(
                          color: Colors.red,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.white,
                            width: 1.5,
                          ),
                        ),
                        child: const Center(
                          child: Text(
                            '3',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRecentActivities(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recent Activities',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 16),
        
        // Activity list
        _buildActivityItem(
          context: context,
          title: 'Marked Attendance',
          description: 'Class 10-A Mathematics',
          time: '2 hours ago',
          icon: Icons.how_to_reg,
          color: Colors.indigo,
        ),
        const SizedBox(height: 12),
        
        _buildActivityItem(
          context: context,
          title: 'New Notification',
          description: 'Parent Meeting Scheduled',
          time: 'Yesterday',
          icon: Icons.notifications,
          color: Colors.red,
        ),
        const SizedBox(height: 12),
        
        _buildActivityItem(
          context: context,
          title: 'Submitted Report',
          description: 'Monthly Attendance Report',
          time: '3 days ago',
          icon: Icons.assessment,
          color: Colors.green,
        ),
      ],
    );
  }

  Widget _buildActivityItem({
    required BuildContext context,
    required String title,
    required String description,
    required String time,
    required IconData icon,
    required Color color,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            CircleAvatar(
              backgroundColor: color.withOpacity(0.2),
              child: Icon(
                icon,
                color: color,
                size: 20,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  Text(
                    description,
                    style: TextStyle(
                      color: Colors.grey.shade600,
                    ),
                  ),
                ],
              ),
            ),
            Text(
              time,
              style: TextStyle(
                color: Colors.grey.shade500,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}