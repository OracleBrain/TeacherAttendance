class Student {
  final int id;
  final String name;
  final String rollNumber;
  final int classId;

  Student({
    required this.id,
    required this.name,
    required this.rollNumber,
    required this.classId,
  });

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      id: json['id'] as int,
      name: json['name'] as String,
      rollNumber: json['rollNumber'] as String,
      classId: json['classId'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'rollNumber': rollNumber,
      'classId': classId,
    };
  }
}