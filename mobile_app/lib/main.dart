import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'services/auth_service.dart';

void main() {
  runApp(const TeacherAttendanceApp());
}

class TeacherAttendanceApp extends StatelessWidget {
  const TeacherAttendanceApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AuthService(),
      child: MaterialApp(
        title: 'Teacher Attendance App',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
          fontFamily: 'Roboto',
          textTheme: const TextTheme(
            headlineMedium: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
            titleLarge: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
            bodyLarge: TextStyle(
              fontSize: 16,
              color: Colors.black87,
            ),
            bodyMedium: TextStyle(
              fontSize: 14,
              color: Colors.black87,
            ),
          ),
        ),
        home: Consumer<AuthService>(
          builder: (context, authService, _) {
            return authService.isAuthenticated
                ? const DashboardScreen()
                : const LoginScreen();
          },
        ),
        routes: {
          '/login': (context) => const LoginScreen(),
          '/dashboard': (context) => const DashboardScreen(),
        },
      ),
    );
  }
}