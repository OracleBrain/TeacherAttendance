class Notification {
  final int id;
  final int userId;
  final String title;
  final String message;
  final bool read;
  final String createdAt;

  Notification({
    required this.id,
    required this.userId,
    required this.title,
    required this.message,
    required this.read,
    required this.createdAt,
  });

  factory Notification.fromJson(Map<String, dynamic> json) {
    return Notification(
      id: json['id'] as int,
      userId: json['userId'] as int,
      title: json['title'] as String,
      message: json['message'] as String,
      read: json['read'] as bool,
      createdAt: json['createdAt'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'title': title,
      'message': message,
      'read': read,
      'createdAt': createdAt,
    };
  }
}