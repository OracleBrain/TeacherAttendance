class Attendance {
  final int id;
  final int studentId;
  final int classId;
  final String date;
  final String status;
  final int teacherId;

  Attendance({
    required this.id,
    required this.studentId,
    required this.classId,
    required this.date,
    required this.status,
    required this.teacherId,
  });

  factory Attendance.fromJson(Map<String, dynamic> json) {
    return Attendance(
      id: json['id'] as int,
      studentId: json['studentId'] as int,
      classId: json['classId'] as int,
      date: json['date'] as String,
      status: json['status'] as String,
      teacherId: json['teacherId'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'studentId': studentId,
      'classId': classId,
      'date': date,
      'status': status,
      'teacherId': teacherId,
    };
  }
}