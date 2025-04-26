class Class {
  final int id;
  final String name;
  final String section;
  final String subject;
  final int teacherId;

  Class({
    required this.id,
    required this.name,
    required this.section,
    required this.subject,
    required this.teacherId,
  });

  factory Class.fromJson(Map<String, dynamic> json) {
    return Class(
      id: json['id'] as int,
      name: json['name'] as String,
      section: json['section'] as String,
      subject: json['subject'] as String,
      teacherId: json['teacherId'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'section': section,
      'subject': subject,
      'teacherId': teacherId,
    };
  }
}