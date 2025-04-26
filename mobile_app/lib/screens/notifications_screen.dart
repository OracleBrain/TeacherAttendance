import 'package:flutter/material.dart';
import '../models/notification.dart' as app_notification;
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({Key? key}) : super(key: key);

  @override
  _NotificationsScreenState createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<app_notification.Notification> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    // Simulating API call delay
    await Future.delayed(const Duration(seconds: 1));
    
    final userId = Provider.of<AuthService>(context, listen: false).currentUser?.id ?? 0;
    
    // Mock notifications data
    final mockNotifications = [
      app_notification.Notification(
        id: 1,
        userId: userId,
        title: 'Attendance Report Due',
        message: 'Please submit the monthly attendance report for Class 10-A by April 30, 2025.',
        read: false,
        createdAt: DateTime.now().subtract(const Duration(hours: 1)).toIso8601String(),
      ),
      app_notification.Notification(
        id: 2,
        userId: userId,
        title: 'Parent Meeting Scheduled',
        message: 'Parent-teacher meeting scheduled for Class 9-B on May 5, 2025 at 4:00 PM.',
        read: false,
        createdAt: DateTime.now().subtract(const Duration(days: 1)).toIso8601String(),
      ),
      app_notification.Notification(
        id: 3,
        userId: userId,
        title: 'System Update',
        message: 'The attendance system will be updated on April 28, 2025. Please save any pending work.',
        read: true,
        createdAt: DateTime.now().subtract(const Duration(days: 2)).toIso8601String(),
      ),
      app_notification.Notification(
        id: 4,
        userId: userId,
        title: 'New Student Enrolled',
        message: 'A new student, Emily Parker, has been enrolled in Class 10-A. Please update your attendance records.',
        read: true,
        createdAt: DateTime.now().subtract(const Duration(days: 3)).toIso8601String(),
      ),
      app_notification.Notification(
        id: 5,
        userId: userId,
        title: 'Holiday Announcement',
        message: 'The school will be closed on May 1, 2025 for Labor Day. Classes will resume on May 2.',
        read: true,
        createdAt: DateTime.now().subtract(const Duration(days: 5)).toIso8601String(),
      ),
    ];
    
    setState(() {
      _notifications = mockNotifications;
      _isLoading = false;
    });
  }

  Future<void> _markAsRead(app_notification.Notification notification) async {
    if (!notification.read) {
      // In a real app, call the API to mark as read
      
      setState(() {
        final index = _notifications.indexWhere((n) => n.id == notification.id);
        if (index != -1) {
          _notifications[index] = app_notification.Notification(
            id: notification.id,
            userId: notification.userId,
            title: notification.title,
            message: notification.message,
            read: true,
            createdAt: notification.createdAt,
          );
        }
      });
    }
  }

  Future<void> _markAllAsRead() async {
    setState(() {
      _notifications = _notifications.map((notification) => 
        app_notification.Notification(
          id: notification.id,
          userId: notification.userId,
          title: notification.title,
          message: notification.message,
          read: true,
          createdAt: notification.createdAt,
        )
      ).toList();
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('All notifications marked as read'),
      ),
    );
  }

  Future<void> _refreshNotifications() async {
    setState(() {
      _isLoading = true;
    });
    
    await _loadNotifications();
  }

  String _formatTimeAgo(String dateTimeString) {
    final dateTime = DateTime.parse(dateTimeString);
    final now = DateTime.now();
    final difference = now.difference(dateTime);
    
    if (difference.inDays > 7) {
      return DateFormat.yMMMd().format(dateTime);
    } else if (difference.inDays > 0) {
      return '${difference.inDays} ${difference.inDays == 1 ? 'day' : 'days'} ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} ${difference.inHours == 1 ? 'hour' : 'hours'} ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} ${difference.inMinutes == 1 ? 'minute' : 'minutes'} ago';
    } else {
      return 'Just now';
    }
  }

  @override
  Widget build(BuildContext context) {
    // Count unread notifications
    final unreadCount = _notifications.where((n) => !n.read).length;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          if (unreadCount > 0)
            IconButton(
              icon: const Icon(Icons.done_all),
              tooltip: 'Mark all as read',
              onPressed: _markAllAsRead,
            ),
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Refresh',
            onPressed: _refreshNotifications,
          ),
        ],
      ),
      body: _isLoading 
          ? const Center(child: CircularProgressIndicator())
          : _notifications.isEmpty
              ? _buildEmptyState()
              : RefreshIndicator(
                  onRefresh: _refreshNotifications,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(8.0),
                    itemCount: _notifications.length,
                    itemBuilder: (context, index) {
                      final notification = _notifications[index];
                      return _buildNotificationItem(notification);
                    },
                  ),
                ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.notifications_off,
            size: 64,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 16),
          Text(
            'No notifications',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey.shade700,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'When you receive notifications, they will appear here',
            style: TextStyle(
              color: Colors.grey.shade600,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _refreshNotifications,
            icon: const Icon(Icons.refresh),
            label: const Text('Refresh'),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationItem(app_notification.Notification notification) {
    final timeAgo = _formatTimeAgo(notification.createdAt);
    
    return Dismissible(
      key: Key('notification-${notification.id}'),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 16.0),
        color: Colors.red,
        child: const Icon(
          Icons.delete,
          color: Colors.white,
        ),
      ),
      onDismissed: (direction) {
        setState(() {
          _notifications.removeWhere((n) => n.id == notification.id);
        });
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Notification dismissed'),
            action: SnackBarAction(
              label: 'UNDO',
              onPressed: () {
                setState(() {
                  _notifications.add(notification);
                  _notifications.sort((a, b) => 
                    DateTime.parse(b.createdAt).compareTo(DateTime.parse(a.createdAt))
                  );
                });
              },
            ),
          ),
        );
      },
      child: Card(
        margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
        color: notification.read ? null : Colors.blue.shade50,
        child: InkWell(
          onTap: () {
            _markAsRead(notification);
            _showNotificationDetails(notification);
          },
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Notification icon
                    CircleAvatar(
                      backgroundColor: notification.read 
                          ? Colors.blue.shade100 
                          : Colors.blue.shade400,
                      radius: 20,
                      child: Icon(
                        _getNotificationIcon(notification.title),
                        color: notification.read 
                            ? Colors.blue.shade800 
                            : Colors.white,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 12),
                    
                    // Notification content
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  notification.title,
                                  style: TextStyle(
                                    fontWeight: notification.read 
                                        ? FontWeight.normal 
                                        : FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                              ),
                              if (!notification.read)
                                Container(
                                  width: 10,
                                  height: 10,
                                  decoration: BoxDecoration(
                                    color: Colors.blue,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            notification.message,
                            style: TextStyle(
                              color: Colors.grey.shade700,
                              fontSize: 14,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            timeAgo,
                            style: TextStyle(
                              color: Colors.grey.shade500,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  IconData _getNotificationIcon(String title) {
    if (title.contains('Attendance')) {
      return Icons.assignment;
    } else if (title.contains('Meeting')) {
      return Icons.people;
    } else if (title.contains('Update')) {
      return Icons.system_update;
    } else if (title.contains('Student')) {
      return Icons.person_add;
    } else if (title.contains('Holiday')) {
      return Icons.event;
    } else {
      return Icons.notifications;
    }
  }

  void _showNotificationDetails(app_notification.Notification notification) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(16),
        ),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: Colors.blue.shade100,
                  child: Icon(
                    _getNotificationIcon(notification.title),
                    color: Colors.blue.shade800,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    notification.title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const Divider(),
            const SizedBox(height: 8),
            Text(
              notification.message,
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16),
            Text(
              'Received: ${_formatTimeAgo(notification.createdAt)}',
              style: TextStyle(
                color: Colors.grey.shade600,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  icon: const Icon(Icons.delete),
                  label: const Text('DISMISS'),
                  onPressed: () {
                    setState(() {
                      _notifications.removeWhere((n) => n.id == notification.id);
                    });
                    Navigator.pop(context);
                  },
                ),
                const SizedBox(width: 8),
                ElevatedButton.icon(
                  icon: const Icon(Icons.check),
                  label: const Text('MARK AS READ'),
                  onPressed: () {
                    _markAsRead(notification);
                    Navigator.pop(context);
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}